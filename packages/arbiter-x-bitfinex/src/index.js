import WebSocket from 'ws';
import crypto from 'crypto-js';

const baseUrl = 'wss://api.bitfinex.com/ws/2';

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

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', (resp) => {
			const respJSON = JSON.parse(resp);

			otherListener(resp);
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

	subscribeToTicker(oSymbol="ETHUSD") {
		const event = "subscribe";

		const channel = "ticker";

		const symbol = `t${oSymbol}`;

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
