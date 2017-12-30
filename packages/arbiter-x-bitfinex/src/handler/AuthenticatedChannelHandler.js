import {
	Ticker,
	Balance,
	Order
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
			data.filter(([type]) => type === 'exchange')
			.map(item => new Balance(item))

		this.event.emit('balance', validBalances)
	}

	balanceUpdate(data) {
		this.event.emit(`balance-update`, new Balance(data))
	}

	order(data) {
		this.event.emit('order', new Order(data))
	}

	orders(data) {
		const orders = data.map((d) => new Order(d))

		this.event.emit('orders', orders)
	}

	tradeExecuted(data) {

	}

	auth(chanSymbol, data) {

		switch(chanSymbol) {
		case 'ws':
			this.event.emit('auth')
			this.balance(data)
			return true
		case 'wu':
			this.balanceUpdate(data)
			return true
		case 'os':
			this.orders(data)
			return true
		case 'on':
		case 'ou':
		case 'oc':
			this.order(data)
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

		// console.log(chanSymbol, data);

		return this[channel](chanSymbol, data);
	}
}
