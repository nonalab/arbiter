import EventEmitter from 'events';
import WebSocket from 'ws';

import crypto from 'crypto';

import fetch from 'node-fetch';

import {
	generateRandomInt
} from 'arbiter-util';

import PublicChannelHandler from './handler/PublicChannelHandler';

import AuthenticatedChannelHandler from './handler/AuthenticatedChannelHandler';

const currencyNameMap = {
	'ETH': 'ethereum',
	'BTC': 'bitcoin',
	'LTC': 'litecoin',
	'ZEC': 'zcash',
	'BCH': 'bcash'
}

export default class ArbiterExchangeBitFinex extends EventEmitter {

	constructor(wsUrl = 'wss://api.bitfinex.com/ws/2', restUrl = 'https://api.bitfinex.com/v1') {
		super()

		this.wallet = {}

		this.restUrl = restUrl;

		const wsClient = this.wsClient = new WebSocket(wsUrl, {
			perMessageDeflate: false
		});

		const publicChannelHandler = new PublicChannelHandler(this);

		const authenticatedChannelHandler = new AuthenticatedChannelHandler(this);

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', (resp) => {
			const respJSON = JSON.parse(resp);
			// console.log(respJSON);

			if(respJSON.event)
				return publicChannelHandler.register(respJSON)

			if(publicChannelHandler.evaluate(respJSON))
				return

			if(authenticatedChannelHandler.evaluate(respJSON))
				return

			this.emit('other', respJSON)
		})

		wsClient.on('open', () => this.emit('open'))
		wsClient.on('close', () => this.emit('close'))
		wsClient.on('error', (error) => this.emit('error', error))

		this.once('balance', this.initLocalWallet)

		this.on('balance-update', this.updateLocalWallet)
	}

	initLocalWallet(balances) {
		balances.map((balance) => {
			this.wallet[balance.currency] = balance
		})
	}

	updateLocalWallet(balance) {
		this.wallet[balance.currency] = balance
	}

	/* Waiting Coroutine */
	async waitFor(eventName) {
		const self = this;
		return new Promise(function (resolve, reject) {
			self.once(eventName, resolve)
		});
	}

	async waitForWalletUpdate(
		currentAmount, targetDiff, currency, withdrawal = true
	) {
		const updatedBalance = await this.waitFor('balance-update');

		if(updatedBalance.currency !== currency) {
			return waitForWalletUpdate(currentAmount, targetDiff, currency, withdrawal = true)
		}

		const diff = Math.abs(currentAmount - updatedBalance.available);

		if(diff < targetDiff) {
			return waitForWalletUpdate(currentAmount, targetDiff, currency, withdrawal = true);
		}
	}

	async open() {
		return this.waitFor('open')
	}

	async close() {
		this.wsClient.close()
		return this.waitFor('close')
	}

	send(socketMessage) {
		if(!socketMessage) return;
		this.wsClient.send(JSON.stringify(socketMessage))
	}

	async rest(route, data) {
		try {
			const {
				restUrl,
				key,
				secret
			} = this;

			const nonce = Date.now()
				.toString()

			const body = JSON.stringify({
				request: `/v1/${route}`,
				nonce,
				...data
			})

			const payload = new Buffer(body)
				.toString('base64')

			const signature = crypto.createHmac('sha384', secret)
				.update(payload)
				.digest('hex');

			const headers = {
				'X-BFX-APIKEY': key,
				'X-BFX-PAYLOAD': payload,
				'X-BFX-SIGNATURE': signature
			}

			const resp = await fetch(`${restUrl}/${route}`, {
				method: 'POST',
				headers,
				body
			})

			const respJSON = await resp.json()

			return respJSON
		} catch(error) {
			this.emit('error', {
				error
			})
			return null
		}
	}

	async get(route) {
		return this.rest(route)
	}

	async post(route, body) {
		return this.rest(route, body)
	}

	/* Streaming APIs: */
	subscribeToReports() {}

	subscribeToTicker(pair = ['EOS', 'ETH']) {
		this.send({
			event: 'subscribe',
			channel: 'ticker',
			symbol: `t${pair.join('')}`,
		})
	}

	/* REST-like APIs: */

	async requestDepositAddress(currency = 'ETH') {
		const method = currencyNameMap[currency];

		const data = await this.post(`deposit/new`, {
			method: currencyNameMap[currency],
			'wallet_name': 'exchange'
		})

		if(!data || !data.address || data.result === 'error') {
			this.emit('error', {
				error: data
			})

			return null
		}

		return data.address;
	}

	async requestWithdrawCrypto({
		currency = 'ETH',
		amount = 0.5,
		address = '0x74D5bCAF1ec7CF4BFAF4bb67D51D00dD821c5bF6',
		serious = false
	}) {
		if(!serious) {
			return null
		}
		// Send from main wallet to the designated
		const data = await this.post(`withdraw`, {
			'withdraw_type': currencyNameMap[currency],
			'walletselected': 'exchange',
			address,
			amount: amount + '',
		})

		if(!data || data[0].result !== 'success') {
			this.emit('error', {
				error: data[0]
			})

			return null
		}

		const currentAmount = this.wallet[currency]

		await waitForWalletUpdate(currentAmount, amount, currency)

		return data[0];
	}

	async requestBuyOrder({
		pair = ['EOS', 'ETH'],
		quantity = 0.04,
		price = 0
	}) {
		const symbol = pair.join('')

		const params = this.makeOrderParams(`t${symbol}`, `${quantity}`, price)

		this.send([0, "on", null, params])

		const data = await Promise.race([
			this.waitFor('order'),
			this.waitFor('error')
		])

		if(data.error) {
			return null
		}

		return data
	}

	async requestSellOrder({
		pair = ['EOS', 'ETH'],
		quantity = 2.0,
		price = 0
	}) {
		const symbol = pair.join('')

		const params = await this.makeOrderParams(`t${symbol}`, `${-1 * quantity}`, price)

		this.send([0, "on", null, params])

		const data = await Promise.race([
			this.waitFor('order'),
			this.waitFor('error')
		])

		if(data.error) {
			return null
		}

		return data
	}

	requestCancelOrder(id) {
		this.send([0, 'oc', null, {
			id
		}])
		return this.waitFor('order')
	}

	requestTradingBalance() {}

	async authenticate({
		key,
		secret
	}) {
		this.key = key;
		this.secret = secret;

		const event = 'auth';

		const nonce = Date.now() + Math.random()
			.toString()

		const payload = 'AUTH' + nonce;

		const filter = [
			'trading',
			'wallet',
			'balance'
		]

		const signature = crypto.createHmac('sha384', secret)
			.update(payload)
			.digest('hex');

		this.send({
			event,
			filter,
			apiKey: key,
			authSig: signature,
			authNonce: nonce,
			authPayload: payload,
		})

		return this.waitFor('auth')
	}


	makeOrderParams(symbol, amount, price) {
		const cid = generateRandomInt(36)

		const params = {
			cid,
			symbol,
			amount
		}

		if(!price) {
			params.type = 'EXCHANGE MARKET'
		} else {
			params.type = 'EXCHANGE LIMIT'
			params.price = '' + price
		}

		return params;
	}
}
