import WebSocket from 'ws';
import crypto from 'crypto';

import ResponseHandler, {
	EVENT_ID
} from './handlers/ResponseHandler';

import SnapshotHandler from './handlers/SnapshotHandler';

const EVENTS = ['auth', 'order', 'ticker', 'balance', 'close', 'other']

export default class ArbiterExchangeHitBTC {

	constructor(baseUrl = 'wss://api.hitbtc.com/api/2/ws') {
		this.event = {}

		EVENTS.map(name => this.event[name] = () => {})

		const wsClient = this.wsClient = new WebSocket(baseUrl, {
			perMessageDeflate: false
		});

		const responseHandler = new ResponseHandler(this.event);

		const snapshotHandler = new SnapshotHandler(this.event);

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', (resp) => {
			const respJSON = JSON.parse(resp);

			if(responseHandler.evaluate(respJSON))
				return;

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

	async open() {
		const {
			wsClient
		} = this;
		return new Promise(function (resolve, reject) {
			wsClient.on('open', () => {
				resolve()
			})
		});
	}

	subscribeToReports() {
		const method = "subscribeReports";

		const socketMessage = {
			method,
			params: {}
		}

		this.wsClient.send(JSON.stringify(socketMessage))
	}

	subscribeToTicker(symbol = "ETHUSD") {
		const method = "subscribeTicker";

		const socketMessage = {
			method,
			params: {
				symbol
			}
		}

		this.wsClient.send(JSON.stringify(socketMessage))
	}

	authenticate({
		key,
		secret
	}) {
		const id = EVENT_ID.auth;

		const method = "login";

		const algo = "HS256";

		// Authentication using sha256 is something boggling :O
		const nonce = Date.now() + Math.random()
			.toString()

		const signature = crypto.createHmac('sha256', secret)
			.update(nonce)
			.digest('hex');

		const socketMessage = {
			method,
			params: {
				algo,
				pKey: key,
				nonce,
				signature
			},
			id
		}

		this.wsClient.send(JSON.stringify(socketMessage))
	}

}
