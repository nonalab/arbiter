import EventEmitter from 'events';
import WebSocket from 'ws';

import crypto from 'crypto-js';

import {
	generateRandomInt
} from 'arbiter-util';

import PublicChannelHandler from './handler/PublicChannelHandler';

import AuthenticatedChannelHandler from './handler/AuthenticatedChannelHandler';

export default class ArbiterExchangeBitFinex extends EventEmitter {

	constructor(baseUrl = 'wss://api.bitfinex.com/ws/2') {
		super()

		const wsClient = this.wsClient = new WebSocket(baseUrl, {
			perMessageDeflate: false
		});

		const publicChannelHandler = new PublicChannelHandler(this);

		const authenticatedChannelHandler = new AuthenticatedChannelHandler(this);


		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', (resp) => {
			const respJSON = JSON.parse(resp);
			if(respJSON.event) {
				console.log(respJSON);
				return publicChannelHandler.register(respJSON);
			}

			if(publicChannelHandler.evaluate(respJSON))
				return;

			if(authenticatedChannelHandler.evaluate(respJSON))
				return;

			this.emit('other', respJSON)
		})

		wsClient.on('close', () => this.emit('close'))
	}

	async open() {
		const {
			wsClient
		} = this;
		return new Promise(function (resolve, reject) {
			wsClient.on('open', () => resolve())
		});
	}

	send(socketMessage) {
		if(!socketMessage) return;
		this.wsClient.send(JSON.stringify(socketMessage))
	}

	/* Streaming APIs: */
	subscribeToTicker(symbol = 'ETHUSD') {
		this.send({
			event: 'subscribe',
			channel: 'ticker',
			symbol: `t${symbol}`,
		})
	}

	/* REST-like APIs: */
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

	async waitFor(eventName) {
		const self = this;
		return new Promise(function(resolve, reject) {
			self.once(eventName, resolve)
		});
	}

	async requestBuyOrder({
		symbol = 'ETHUSD',
		quantity = 0.04,
		price = 0
	}) {
		const params = this.makeOrderParams(`t${symbol}`, `${quantity}`, price)

		this.send([0, "on", null, params])

		return params;
	}

	async requestSellOrder({
		symbol = 'ETHUSD',
		quantity = 0.04,
		price = 0
	}) {
		const params = await this.makeOrderParams(`t${symbol}`, `${-1 * quantity}`, price)

		this.send([0, "on", null, params])

		return params;
	}

	requestCancelOrder(id) {
		this.send([0, 'oc', null, {
			id
		}])
	}

	requestTradingBalance() {
		this.send({
			id: 'balance',
			method: 'getTradingBalance',
			params: {}
		})
	}

	async authenticate({
		key,
		secret
	}) {
		const self = this;

		const event = 'auth';

		const nonce = Date.now() + Math.random()
			.toString()

		const payload = 'AUTH' + nonce;

		const filter = [
			'trading',
			'wallet',
			'balance'
		]

		const signature = crypto
			.HmacSHA384(payload, secret)
			.toString(crypto.enc.Hex)

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

}
