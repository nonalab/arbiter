'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.generateOrderId = exports.wait = undefined;

var wait = exports.wait = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(duration) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						return _context.abrupt('return', new Promise(function (resolve, reject) {
							setTimeout(function () {
								resolve();
							}, duration);
						}));

					case 1:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function wait(_x) {
		return _ref.apply(this, arguments);
	};
}();

var generateOrderId = exports.generateOrderId = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
		var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						return _context2.abrupt('return', new Promise(function (resolve, reject) {
							_crypto2.default.randomBytes(size, function (err, buf) {
								if (err) reject(err);
								resolve(buf.toString('hex'));
							});
						}));

					case 1:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function generateOrderId() {
		return _ref2.apply(this, arguments);
	};
}();

exports.taggedLog = taggedLog;
exports.tickerListener = tickerListener;
exports.orderListener = orderListener;
exports.authListener = authListener;
exports.otherListener = otherListener;
exports.balanceListener = balanceListener;
exports.errorListener = errorListener;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function taggedLog(tag, info) {
	console.log(' --- --- --- --- ' + tag + ' --- --- --- --- ----');
	console.log(info);
}

function tickerListener(ticker) {
	taggedLog('TICKER - ' + ticker.symbol, ticker.toString());
}

function orderListener(order) {
	taggedLog('ORDER - ' + order.side + ' - ' + order.symbol, order.toString());
}

function authListener(respJSON) {
	taggedLog('AUTH', respJSON);
}

function otherListener(respJSON) {
	taggedLog('OTHER', respJSON);
}

function balanceListener(data) {
	taggedLog('BALANCE', data);
}

function errorListener(data) {
	taggedLog('ERROR', data);
}