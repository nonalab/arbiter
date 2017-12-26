import EventEmitter from 'events';
import WebSocket from 'ws';

import crypto from 'crypto-js';

import {
	generateOrderId
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
	subscribeToTicker(rawSymbol = 'ETHUSD') {
		this.send({
			event: 'subscribe',
			channel: 'ticker',
			symbol: `t${rawSymbol}`,
		})
	}

	/* REST-like APIs: */
	async makeOrderParams(side, symbol, quantity, price) {
		const clientOrderId = await generateOrderId()

		const params = {
			side,
			symbol,
			quantity,
			clientOrderId,
		}

		if(!price) {
			params.type = 'market'
			params.timeInForce = 'IOC'
		} else {
			params.price = price
		}

		return params;
	}
	
	async requestBuyOrder(symbol = 'ETHUSD', quantity = 0.01, price = 0) {

		const params = await this.makeOrderParams('buy', symbol, quantity, price, )

		this.send({
			id: 'buy',
			method: 'newOrder',
			params
		})

		const self = this;

		return new Promise(function (resolve, reject) {
			self.on('buy', (order) => {
				if(order.id === params.clientOrderId) {
					resolve(order)
				}
			})
		})
	}

	async requestSellOrder(symbol = 'ETHUSD', quantity = 0.01, price = 0) {
		const params = await this.makeOrderParams('sell', symbol, quantity, price, )

		this.send({
			id: 'sell',
			method: 'newOrder',
			params
		})

		const self = this;

		return new Promise(function (resolve, reject) {
			self.on('sell', (order) => {
				if(order.id === params.clientOrderId) {
					resolve(order)
				}
			})
		})
	}

	requestCancelOrder(clientOrderId) {
		this.send({
			id: 'cancel',
			method: 'cancelOrder',
			params: {
				clientOrderId
			}
		})
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

		return new Promise(function (resolve, reject) {
			self.on('auth', resolve)
		})
	}

}
