const METHOD_ID = {
	ticker: 'ticker'
}

import Ticker from '../models/Ticker';

export default class NotificationHandler {
	constructor(event) {
		this.event = event;
	}

	ticker(data) {
		this.event['ticker'](new Ticker(data))
	}

	evaluate({
		method,
		params
	}) {
		if(!method) {
			return false
		}

		switch(method) {
		case METHOD_ID.ticker:
			{
				this.ticker(params);
				return true;
			}
		default:
			return false;
		}
	}
}
