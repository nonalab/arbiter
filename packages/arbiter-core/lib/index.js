'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var init = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
		var bitFinexInstance, hitBTCInstance, _ref2, _ref3, data;

		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						console.log('INIT |||');
						bitFinexInstance = new _arbiterXBitfinex2.default();
						hitBTCInstance = new _arbiterXHitbtc2.default();
						_context.next = 5;
						return Promise.all([_fsExtra2.default.readJson(dbPath), bitFinexInstance.open(), hitBTCInstance.open()]);

					case 5:
						_ref2 = _context.sent;
						_ref3 = _slicedToArray(_ref2, 1);
						data = _ref3[0];


						hitBTCInstance.authenticate(_credentials2.default.hitbtc);
						bitFinexInstance.authenticate(_credentials2.default.bitfinex);

						data.watchingPairs.map(function (pair) {
							hitBTCInstance.subscribeToTicker(pair);
							bitFinexInstance.subscribeToTicker(pair);
						});

						hitBTCInstance.on('ticker', function (ticker) {
							return tickerListener('HITBTC', ticker);
						});
						bitFinexInstance.on('ticker', function (ticker) {
							return tickerListener('BITFIN', ticker);
						});

					case 13:
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
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						console.log('UPDATE >>>');

					case 1:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function update() {
		return _ref4.apply(this, arguments);
	};
}();

var exit = function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
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
		return _ref5.apply(this, arguments);
	};
}();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _main = require('./main');

var _utils = require('./utils');

var _arbiterXBitfinex = require('arbiter-x-bitfinex');

var _arbiterXBitfinex2 = _interopRequireDefault(_arbiterXBitfinex);

var _arbiterXHitbtc = require('arbiter-x-hitbtc');

var _arbiterXHitbtc2 = _interopRequireDefault(_arbiterXHitbtc);

var _credentials = require('../credentials.json');

var _credentials2 = _interopRequireDefault(_credentials);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var dbPath = _path2.default.resolve(__dirname, '../db.json');

var UPDATE_INTERVAL = 500;

(0, _main.foreverProcess)({
	init: init,
	update: update,
	exit: exit
}, UPDATE_INTERVAL);

function tickerListener(exchange, _ref6) {
	var ask = _ref6.ask,
	    bid = _ref6.bid,
	    symbol = _ref6.symbol,
	    time = _ref6.time;

	(0, _utils.taggedLog)('TICKER - ' + exchange + ' - ' + symbol, 'ASK: ' + ask + ' - BID: ' + bid + ' - TIME: ' + time);
}