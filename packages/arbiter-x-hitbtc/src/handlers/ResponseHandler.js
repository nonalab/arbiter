export const EVENT_ID = {
	// Response events, ID matters
	balance: 0,
	auth: 1,
	newOrder: 2
}

export default class ResponseHandler {
	constructor(event) {
		this.event = event;
		this.eventId = Object.assign({}, EVENT_ID);
	}

	balance(data) {
		this.event['balance'](data)
	}

	auth(data) {
		this.event['auth'](data)
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
		default:
			return false
		}
	}
}
