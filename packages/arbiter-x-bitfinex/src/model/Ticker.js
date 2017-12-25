import {
	Ticker as DefaultTicker
} from 'arbiter-model';

export class Ticker extends DefaultTicker {
	constructor(symbol, [bid, bidSize, ask, askSize, dailyChange, dailyChangePerc, last, volume, high, low]) {
		super({
			symbol,
			bid,
			ask,
			last,
			low,
			high,
			volume
		})
	}
}
