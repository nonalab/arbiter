import EventEmitter from 'events';
import WebSocket from 'ws';

import crypto from 'crypto';

import base64 from 'base-64';

import fetch from 'node-fetch';

import {
	generateRandomBytesHex
} from 'arbiter-util';

import ResponseHandler from './handler/ResponseHandler';

import StreamingHandler from './handler/StreamingHandler';

export default class ArbiterExchangeHitBTC extends EventEmitter {

	constructor(wsUrl = 'wss://api.hitbtc.com/api/2/ws', restUrl = 'https://api.hitbtc.com/api/2') {
		super()

		this.restUrl = restUrl;

		const wsClient = this.wsClient = new WebSocket(wsUrl, {
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

		wsClient.on('open', () => this.emit('open'))
		wsClient.on('close', () => this.emit('close'))
		wsClient.on('error', (error) => this.emit('error', error))
	}

	async waitFor(eventName) {
		const self = this;
		return new Promise(function (resolve, reject) {
			self.once(eventName, resolve)
		});
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

	async rest(method, route, body) {
		const {
			restUrl,
			restHeaders
		} = this;

		const resp = await fetch(`${restUrl}/${route}`, {
			method,
			headers: restHeaders,
			body
		})

		const respJSON = await resp.json()

		return respJSON
	}

	async get(route, body) {
		return this.rest('GET', route, body)
	}

	async post(route, body) {
		return this.rest('POST', route, body)
	}

	/* Wallet APIs: */


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
		const clientOrderId = await generateRandomBytesHex()

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

	async requestBuyOrder({
		symbol = 'ETHUSD',
		quantity = 0.01,
		price = 0
	}) {

		const params = await this.makeOrderParams('buy', symbol, quantity, price, )

		this.send({
			id: 'buy',
			method: 'newOrder',
			params
		})

		return params;
	}

	async requestSellOrder({
		symbol = 'ETHUSD',
		quantity = 0.01,
		price = 0
	}) {
		const params = await this.makeOrderParams('sell', symbol, quantity, price, )

		this.send({
			id: 'sell',
			method: 'newOrder',
			params
		})

		return params;
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
		this.restHeaders = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Basic ' + base64.encode(`${key}:${secret}`)
		}

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

		return this.waitFor('auth')
	}
}
