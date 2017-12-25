import EventEmitter from 'events';
import WebSocket from 'ws';

import crypto from 'crypto-js';

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
			self.on('auth', data => data ? resolve() : reject())
		})
	}

}
