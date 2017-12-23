import WebSocket from 'ws';
import crypto from 'crypto-js';

import SnapshotHandler from './handlers/SnapshotHandler';

const EVENTS = ['auth', 'ticker', 'balance', 'close', 'other']

export default class ArbiterExchangeBitFinex {

	constructor(baseUrl = 'wss://api.bitfinex.com/ws/2') {
		this.event = {}

		EVENTS.map(name => this.event[name] = () => {})

		const wsClient = this.wsClient = new WebSocket(baseUrl, {
			perMessageDeflate: false
		});

		const snapshotHandler = new SnapshotHandler(this.event);

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', (resp) => {
			const respJSON = JSON.parse(resp);

			if (respJSON.event) {
				snapshotHandler.register(respJSON);
				return;
			}

			if(snapshotHandler.evaluate(respJSON))
				return;

			this.event['other'](respJSON)
		})

		wsClient.on('close', this.event['close'])
	}

	on(eventName, callback) {
		this.event[eventName] = callback;
		return this;
	}

	async open(){
		const {wsClient} = this;
		return new Promise(function(resolve, reject) {
			wsClient.on('open', () => {
				resolve()
			})
		});
	}

	subscribeToTicker(rawSymbol="ETHUSD") {
		const event = "subscribe";

		const channel = "ticker";

		const symbol = `t${rawSymbol}`;

		const socketMessage = {event, channel, symbol}

		this.wsClient.send(JSON.stringify(socketMessage))
	}

	authenticate({key, secret}) {
		const event = "auth";

		const method = "login";

		const nonce = Date.now() + Math.random().toString()

		const payload = 'AUTH' + nonce;

		const signature = crypto
			.HmacSHA384(payload, secret)
			.toString(crypto.enc.Hex)

		const socketMessage = {
			event,
			apiKey: key,
			authSig: signature,
			authNonce: nonce,
			authPayload: payload,
		}

		this.wsClient.send(JSON.stringify(socketMessage))
	}

}
