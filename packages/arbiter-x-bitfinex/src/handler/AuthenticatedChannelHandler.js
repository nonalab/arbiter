import {
	Ticker,
	Balance
} from '../model';

export default class AuthenticatedChannelHandler {
	constructor(event) {
		this.event = event;

		this.channelMap = {}
		this.channelMap[0] = 'auth'
	}

	register({
		chanId,
		channel
	}) {
		this.channelMap[chanId] = channel;
	}

	balance(data) {
		const validBalances =
			data.filter(([type])=>type==='exchange')
				.map(item => new Balance(item))

		this.event.emit('balance', validBalances)
	}

	auth(chanSymbol, data) {

		switch (chanSymbol) {
			case 'ws':
			this.event.emit('auth')

			return true
			case 'ps':

				return true
			case 'os':

				return true
			default:
				return false
		}
	}

	evaluate([chanId, chanSymbol, data]) {
		const channel = this.channelMap[chanId];

		if(!this[channel]) {
			return false;
		}

		return this[channel](chanSymbol, data);
	}
}
