import WebSocket from 'ws';
import crypto from 'crypto';

const baseUrl = 'wss://api.hitbtc.com/api/2/ws';

const EVENT_ID = {
	// Response events, ID matters
	AUTH: 0,
	BALANCE: 1,
	// Notification events, ID does not matter:
	TICKER: 999,
}

export default class ArbiterExchangeHitBTC {

	constructor({
		authListener = ()=>{},
		tickerListener = ()=>{},
		balanceListener = ()=>{},
		closeListener = ()=>{},
		otherListener = ()=>{}
	}) {

		const wsClient = this.wsClient = new WebSocket(baseUrl, {
			perMessageDeflate: false
		});

		const responseListener = {
			[EVENT_ID.AUTH] : authListener,
			[EVENT_ID.BALANCE] : balanceListener
		}

		const notificationListener = {
			ticker: tickerListener
		}

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', (resp) => {
			const respJSON = JSON.parse(resp);
			const {id, method} = respJSON;

			const listener = (id
					? responseListener[id]
					: notificationListener[method]
				) || otherListener

			listener(respJSON)
		})

		wsClient.on('close', closeListener)
	}

	async open(){
		const {wsClient} = this;
		return new Promise(function(resolve, reject) {
			wsClient.on('open', () => {
				resolve()
			})
		});
	}

	subscribeToTicker(symbol="ETHBTC") {
		const id = EVENT_ID.TICKER;

		const method = "subscribeTicker";

		const socketMessage = {method, params: {symbol}, id}

		this.wsClient.send(JSON.stringify(socketMessage))
	}

	authenticate({key, secret}) {
		const id = EVENT_ID.AUTH;

		const method = "login";

		const algo = "HS256";

		// Authentication using sha256 is something boggling :O
		const nonce = Date.now() + Math.random().toString()

		const signature = crypto.createHmac('sha256', secret).update(nonce).digest('hex');

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
