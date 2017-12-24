import EventEmitter from 'events';
import crypto from 'crypto';
import WebSocket from 'ws';

import ResponseHandler, {
	EVENT_ID
} from './handlers/ResponseHandler';

import SnapshotHandler from './handlers/SnapshotHandler';

const EVENTS = ['auth', 'order', 'ticker', 'balance', 'close', 'other']

export default class ArbiterExchangeHitBTC extends EventEmitter {

	constructor(baseUrl = 'wss://api.hitbtc.com/api/2/ws') {
		super()

		const wsClient = this.wsClient = new WebSocket(baseUrl, {
			perMessageDeflate: false
		});

		const responseHandler = new ResponseHandler(this);

		const snapshotHandler = new SnapshotHandler(this);

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', (resp) => {
			const respJSON = JSON.parse(resp);

			if(responseHandler.evaluate(respJSON))
				return;

			if(snapshotHandler.evaluate(respJSON))
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

	/* Streaming APIs: */
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

	/* REST-like APIs: */
	sendRequest(socketMessage) {
		this.wsClient.send(JSON.stringify(socketMessage))
	}

	requestBuyOrder(clientOrderId, symbol, price, quantity) {
		this.sendRequest({
			id: EVENT_ID.sell,
			method: "newOrder",
			params: {
				side: "buy",
				clientOrderId,
				symbol,
				price,
				quantity,
			}
		})
	}

	requestSellOrder(clientOrderId, symbol, price, quantity) {
		this.sendRequest({
			id: EVENT_ID.sell,
			method: "newOrder",
			params: {
				side: "sell",
				clientOrderId,
				symbol,
				price,
				quantity,
			}
		})
	}

	requestCancelOrder(clientOrderId) {
		this.sendRequest({
			id: EVENT_ID.cancel,
			method: "cancelOrder",
			params: {
				clientOrderId
			}
		})
	}

	requestTradingBalance() {
		this.sendRequest({
			id: EVENT_ID.balance,
			method: "getTradingBalance",
			params: {}
		})
	}

	async authenticate({
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

		this.sendRequest({
			id,
			method,
			params: {
				algo,
				pKey: key,
				nonce,
				signature,
			},
		})

		const self = this;

		return new Promise(function (resolve, reject) {
			self.on('auth', data => data ? resolve() : reject())
		});
	}

}
