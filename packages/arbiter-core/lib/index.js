'use strict';

var init = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						console.log('Initializing ... ');

						_context.next = 3;
						return Promise.all([store.init(), bitFinexInstance.open(), hitBTCInstance.open()]);

					case 3:

						hitBTCInstance.authenticate(store.credential.hitbtc);
						bitFinexInstance.authenticate(store.credential.bitfinex);

						store.pairs.map(function (pair) {
							hitBTCInstance.subscribeToTicker(pair);
							bitFinexInstance.subscribeToTicker(pair);
						});

						hitBTCInstance.on('ticker', function (ticker) {
							return tickerListener('hitbtc', ticker);
						});
						bitFinexInstance.on('ticker', function (ticker) {
							return tickerListener('bitfinex', ticker);
						});

						console.log('Done! Program is running ... ');

					case 9:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function init() {
		return _ref.apply(this, arguments);
	};
}();

var update = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return store.log('price');

					case 2:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function update() {
		return _ref2.apply(this, arguments);
	};
}();

var exit = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						console.log('EXIT...');

					case 1:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function exit() {
		return _ref3.apply(this, arguments);
	};
}();

var _arbiterXBitfinex = require('arbiter-x-bitfinex');

var _arbiterXBitfinex2 = _interopRequireDefault(_arbiterXBitfinex);

var _arbiterXHitbtc = require('arbiter-x-hitbtc');

var _arbiterXHitbtc2 = _interopRequireDefault(_arbiterXHitbtc);

var _arbiterStore = require('arbiter-store');

var _arbiterStore2 = _interopRequireDefault(_arbiterStore);

var _arbiterUtil = require('arbiter-util');

var _main = require('./main');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var UPDATE_INTERVAL = 900;

var bitFinexInstance = new _arbiterXBitfinex2.default();
var hitBTCInstance = new _arbiterXHitbtc2.default();
var store = new _arbiterStore2.default();

(0, _main.foreverProcess)({
	init: init,
	update: update,
	exit: exit
}, UPDATE_INTERVAL);

function tickerListener(exchange, _ref4) {
	var ask = _ref4.ask,
	    bid = _ref4.bid,
	    symbol = _ref4.symbol;

	// taggedLog(`TICKER - ${exchange} - ${symbol}`, `ASK: ${ask} - BID: ${bid} - TIME: ${timestamp}`)
	updatePrice(symbol, exchange, ask, bid);
}

function updatePrice(symbol, exchange, ask, bid) {
	if (!store.price[symbol]) {
		store.price[symbol] = {
			ask: {},
			bid: {}
		};
	}
	store.price[symbol].ask[exchange] = ask;

	store.price[symbol].bid[exchange] = bid;
}