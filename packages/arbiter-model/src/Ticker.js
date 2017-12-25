// Generic ticker for Arbiter
export class Ticker {
	constructor({
		symbol,
		ask,
		bid,
		last,
		low,
		high,
		volume,
		timestamp = Date.now()
	}) {
		this.symbol = symbol;
		this.ask = Number(ask);
		this.bid = Number(bid);
		this.last = Number(last);
		this.low = Number(low);
		this.high = Number(high);
		this.volume = Number(volume);
		this.timestamp = new Date(timestamp);
	}

	toString(){
		return `ASK: ${this.ask} - BID: ${this.bid} - TIME: ${this.timestamp}`
	}
}
