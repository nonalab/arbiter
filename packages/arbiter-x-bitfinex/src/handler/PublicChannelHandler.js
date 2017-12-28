import {
	Ticker
} from '../model';

export default class PublicChannelHandler {
	constructor(event) {
		this.event = event;

		this.channelMap = {}
	}

	register(data) {
		switch(data.event) {
		case 'error':
			this.event.emit('error', data)
			break;
		case 'subscribed':
			this.channelMap[data.chanId] = {
				...data
			}
		default:
			this.event.emit('other', data)
		}
	}

	ticker(pair, data) {
		this.event.emit('ticker', new Ticker(pair, data))
	}

	evaluate([chanId, data]) {
		if(typeof data === 'string' || data.length < 2) {
			return false;
		}

		const {
			channel,
			pair
		} = this.channelMap[chanId];

		if(!this[channel]) {
			return false;
		}

		this[channel](pair, data);

		return true;
	}
}
