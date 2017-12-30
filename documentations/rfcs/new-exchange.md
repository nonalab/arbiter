# New exchange process

Arbiter was designed such that each and every exchange module `arbiter-x` has the exact same API for the core module to consume.

Each `arbiter-x` module should at the minimum implement the following method:

```js
import EventEmitter from 'events';

export default class ArbiterExchangeLAB extends EventEmitter {

	constructor(wsUrl = 'wss://nona.lab', restUrl = 'https://nona.lab') {
		super()
	}

	/* Waiting Coroutine */
	async waitFor(eventName) {}

    /* wait for the connection to open */
	async open() {
		return this.waitFor('open')
	}

    /* Close the connection */
	async close() {
		this.wsClient.close()
		return this.waitFor('close')
	}

    /* Sending socket message */
	send(socketMessage) {
	}

    /* Calling arbitrary REST method to the exchange API */
	async rest(method, route, data) {}

	async get(route) {
		return this.rest('GET', route)
	}

	async post(route, body) {
		return this.rest('POST', route, body)
	}

	/* Streaming APIs: */
	subscribeToReports() {}

	subscribeToTicker(pair = ['ETH', 'BTC']) {}

	/* REST APIs: */

	async requestDepositAddress(currency = 'ETH') {
    }

	async requestFundTransfer(currency, amount, type) {
	}

	async requestWithdrawCrypto({
		currency = 'ETH',
		amount = 0.02,
		address = '0x74D5bCAF1ec7CF4BFAF4bb67D51D00dD821c5bF6',
		serious = false
	}) {
	}

	async requestFundToExchange(currency, quantity) {
	}

	async requestBuyOrder({
		pair = ['EOS', 'ETH'],
		quantity = 0.01,
		price = 0
	}) {
	}

	async requestSellOrder({
		pair = ['EOS', 'ETH'],
		quantity = 0.01,
		price = 0
	}) {
	}

	requestCancelOrder(id) {
	}

	requestTradingBalance() {
	}

    /*
        Return a promise that resolve once the authentication is done
        */
	async authenticate({
		key,
		secret
	}) {

	}
}

```
