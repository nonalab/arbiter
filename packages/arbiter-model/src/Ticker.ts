// Generic ticker for Arbiter
export class Ticker {
    ask: number
    bid: number
    last: number
    open: number
    low: number
    high: number

    constructor(ask, bid, last, open, low, high) {
        this.ask = ask;
        this.bid = bid;
        this.last = last;
        this.open = open;
        this.low = low;
        this.high = high;
    }
}
