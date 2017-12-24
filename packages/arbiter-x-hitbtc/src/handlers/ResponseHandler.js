import {
	Balance
} from 'arbiter-model';

export const EVENT_ID = {
	// Response events, ID matters
	auth: 1,
	balance: 2,
	buy: 3,
	sell: 4,
	cancel: 5,
	activeOrders: 6
}

export default class ResponseHandler {
	constructor(event) {
		this.event = event;
		this.eventId = Object.assign({}, EVENT_ID);
	}

	activeOrders(data) {
		this.event.emit('order',data)
	}

	balance(data) {
		const validBalances = data.map(item => new Balance(item))
			.filter(balance => balance.isFunded())

		this.event.emit('balance', validBalances)
	}

	auth(data) {
		console.log("AUTHED");
		this.event.emit('auth', data)
	}

	evaluate({
		id,
		result
	}) {
		if(!id) {
			return false
		}

		switch(id) {
		case this.eventId.balance:
			{
				this.balance(result)
				return true;
			}
		case this.eventId.auth:
			{
				this.auth(result)
				return true;
			}
		case this.eventId.activeOrders:
			{
				this.activeOrders(result)
				return true;
			}
		default:
			return false
		}
	}
}
