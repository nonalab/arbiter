import EventEmitter from 'events';
import WebSocket from 'ws';

import crypto from 'crypto';

import {
	generateOrderId
} from 'arbiter-util';

import ResponseHandler from './handler/ResponseHandler';

import StreamingHandler from './handler/StreamingHandler';

export default class ArbiterExchangeHitBTC extends EventEmitter {

	constructor(baseUrl = 'wss://api.hitbtc.com/api/2/ws') {
		super()

		const wsClient = this.wsClient = new WebSocket(baseUrl, {
			perMessageDeflate: false
		});

		const responseHandler = new ResponseHandler(this);

		const streamingHandler = new StreamingHandler(this);

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', (resp) => {
			const respJSON = JSON.parse(resp);

			if(responseHandler.evaluate(respJSON))
				return;

			if(streamingHandler.evaluate(respJSON))
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
		})
	}

	send(socketMessage) {
		if(!socketMessage) return;
		this.wsClient.send(JSON.stringify(socketMessage))
	}

	/* Streaming APIs: */
	subscribeToReports() {
		this.send({
			method: 'subscribeReports',
			params: {}
		})
	}

	subscribeToTicker(symbol = 'ETHUSD') {
		this.send({
			method: 'subscribeTicker',
			params: {
				symbol
			}
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

		const id = 'auth';
		const method = 'login';
		const algo = 'HS256';

		// Authentication using sha256 is something boggling :O
		const nonce = Date.now() + Math.random()
			.toString()

		const signature = crypto.createHmac('sha256', secret)
			.update(nonce)
			.digest('hex');

		this.send({
			id,
			method,
			params: {
				algo,
				pKey: key,
				nonce,
				signature,
			},
		})

		return new Promise(function (resolve, reject) {
			self.on('auth', data => data ? resolve() : reject())
		})
	}
}
