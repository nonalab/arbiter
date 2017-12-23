"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Generic ticker for Arbiter
var Ticker = exports.Ticker = function Ticker(_ref) {
    var symbol = _ref.symbol,
        ask = _ref.ask,
        bid = _ref.bid,
        last = _ref.last,
        open = _ref.open,
        low = _ref.low,
        high = _ref.high,
        _ref$time = _ref.time,
        time = _ref$time === undefined ? Date.now() : _ref$time;

    _classCallCheck(this, Ticker);

    this.symbol = symbol;
    this.ask = ask;
    this.bid = bid;
    this.last = last;
    this.open = open;
    this.low = low;
    this.high = high;
    this.time = new Date(time);
};