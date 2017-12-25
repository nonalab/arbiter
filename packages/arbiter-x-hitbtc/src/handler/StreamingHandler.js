import {
	Ticker
} from 'arbiter-model';

import {
	Order
} from '../model';

export default class StreamingHandler {
	constructor(event) {
		this.event = event;
	}

	/*
	{"channel":"ticker","type":"update","data":{"ask":"0.053440","bid":"0.053341","last":"0.053445","open":"0.049779","low":"0.046764","high":"0.054361","volume":"115040.853","volumeQuote":"5872.911384124","timestamp":"2017-11-13T02:45:14.146Z","symbol":"ETHBTC"}}
	*/
	ticker(data) {
		this.event.emit('ticker', new Ticker(data))
	}

	activeOrders(data) {
		const orders = data.map((order) => new Order(order))

		this.event.emit('orders', orders)
	}

	report(data) {
		this.event.emit('order', new Order(data))
	}

	evaluate({
		method,
		params
	}) {
		if(!method || !this[method]) {
			return false
		}

		this[method](params)

		return true
	}
}
