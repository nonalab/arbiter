import {
	Balance
} from 'arbiter-model';

export const EVENT_ID = {
	// Response events, ID matters
	auth: 'auth',
	balance: 'balance',
	buy: 'buy',
	sell: 'sell',
	cancel: 'cancel'
}

export default class ResponseHandler {
	constructor(event) {
		this.event = event;
		this.eventId = Object.assign({}, EVENT_ID);
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
		this.event.emit('buy', data)
	}

	sell(data) {
		this.event.emit('sell', data)
	}

	cancel(data) {
		this.event.emit('cancel', data)
	}

	evaluate({
		id,
		result,
		error
	}) {
		if(!id || !this.eventId[id]) {
			return false
		}

		if(error) {
			this.event.emit('error', error)
		} else {
			this[this.eventId[id]](result)
		}

		return true
	}
}
