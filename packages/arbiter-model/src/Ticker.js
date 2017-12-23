// Generic ticker for Arbiter
export class Ticker {
    constructor({
        symbol, ask, bid, last, low, high, volume, timestamp = Date.now()
    }) {
        this.symbol = symbol;
        this.ask = ask;
        this.bid = bid;
        this.last = last;
        this.low = low;
        this.high = high;
        this.volume = volume;
        this.timestamp = new Date(timestamp);
    }


}
