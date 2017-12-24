"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var wait = exports.wait = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(duration) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						return _context.abrupt("return", new Promise(function (resolve, reject) {
							setTimeout(function () {
								resolve();
							}, duration);
						}));

					case 1:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function wait(_x) {
		return _ref.apply(this, arguments);
	};
}();

exports.taggedLog = taggedLog;
exports.tickerListener = tickerListener;
exports.orderListener = orderListener;
exports.authListener = authListener;
exports.otherListener = otherListener;
exports.balanceListener = balanceListener;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function taggedLog(tag, info) {
	console.log(" --- --- --- --- " + tag + " --- --- --- --- ----");
	console.log(info);
}

function tickerListener(_ref2) {
	var ask = _ref2.ask,
	    bid = _ref2.bid,
	    symbol = _ref2.symbol,
	    timestamp = _ref2.timestamp;

	taggedLog("TICKER - " + symbol, "ASK: " + ask + " - BID: " + bid + " - TIME: " + timestamp);
}

function orderListener(data) {
	taggedLog("ORDER - ", data);
}

function authListener(respJSON) {
	taggedLog("AUTH", respJSON);
}

function otherListener(respJSON) {
	taggedLog("OTHER", respJSON);
}

function balanceListener(data) {
	taggedLog("BALANCE", data);
}