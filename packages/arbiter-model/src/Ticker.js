// Generic ticker for Arbiter
export class Ticker {
    constructor({
        symbol, ask, bid, last, open, low, high, time = Date.now()
    }) {
        this.symbol = symbol;
        this.ask = ask;
        this.bid = bid;
        this.last = last;
        this.open = open;
        this.low = low;
        this.high = high;
        this.time = new Date(time);
    }


}
