export const EVENT_ID = {
	// Response events, ID matters
	balance: 0,
	auth: 1
}

export default class ResponseHandler {
	constructor(event) {
		this.event = event;
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
		case EVENT_ID.balance:
			{
				this.balance(result)
				return true;
			}
		case EVENT_ID.auth:
			{
				this.auth(result)
				return true;
			}
		default:
			return false
		}
	}
}
