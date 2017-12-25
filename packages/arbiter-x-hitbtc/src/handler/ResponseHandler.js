import {
	Balance
} from 'arbiter-model';

import {
	Order
} from '../model';

export default class ResponseHandler {
	constructor(event) {
		this.event = event;
	}

	balance(data) {
		const validBalances = data.map(item => new Balance(item))
			.filter(balance => balance.isFunded())

		this.event.emit('balance', validBalances)
	}

	auth(data) {
		this.event.emit('auth', data)
	}

	buy(data) {
		this.event.emit('buy', new Order(data))
	}

	sell(data) {
		this.event.emit('sell', new Order(data))
	}

	cancel(data) {
		this.event.emit('cancel', data)
	}

	evaluate({
		id,
		result,
		error
	}) {
		if(!id || !this[id]) {
			return false
		}

		if(error) {
			this.event.emit('error', error)
		} else {
			this[id](result)
		}

		return true
	}
}
