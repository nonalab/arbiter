import {Ticker} from 'arbiter-model';

export default class SnapshotHandler {
	constructor(event) {
		this.event = event;

		this.methodId = {
			ticker: 'ticker'
		}
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
		case this.methodId.ticker:
			{
				this.ticker(params);
				return true;
			}
		default:
			return false;
		}
	}
}
