'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.foreverProcess = undefined;

/**
    Skeleton for a program that run forever
*/
var foreverProcess = exports.foreverProcess = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_ref) {
		var _this = this;

		var _ref$init = _ref.init,
		    init = _ref$init === undefined ? _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		})) : _ref$init,
		    _ref$update = _ref.update,
		    update = _ref$update === undefined ? _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, _this);
		})) : _ref$update,
		    _ref$exit = _ref.exit,
		    exit = _ref$exit === undefined ? _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
			return regeneratorRuntime.wrap(function _callee3$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
						case 'end':
							return _context3.stop();
					}
				}
			}, _callee3, _this);
		})) : _ref$exit;
		var updateInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						process.on('SIGTERM', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
							return regeneratorRuntime.wrap(function _callee4$(_context4) {
								while (1) {
									switch (_context4.prev = _context4.next) {
										case 0:
											_context4.next = 2;
											return exit();

										case 2:
											process.exit(0);

										case 3:
										case 'end':
											return _context4.stop();
									}
								}
							}, _callee4, _this);
						})));

						process.on('SIGINT', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
							return regeneratorRuntime.wrap(function _callee5$(_context5) {
								while (1) {
									switch (_context5.prev = _context5.next) {
										case 0:
											_context5.next = 2;
											return exit();

										case 2:
											process.exit(0);

										case 3:
										case 'end':
											return _context5.stop();
									}
								}
							}, _callee5, _this);
						})));

						process.stdin.resume();

						_context6.prev = 3;
						_context6.next = 6;
						return init();

					case 6:
						if (!'ever') {
							_context6.next = 13;
							break;
						}

						_context6.next = 9;
						return (0, _arbiterUtil.wait)(updateInterval);

					case 9:
						_context6.next = 11;
						return update();

					case 11:
						_context6.next = 6;
						break;

					case 13:
						_context6.next = 19;
						break;

					case 15:
						_context6.prev = 15;
						_context6.t0 = _context6['catch'](3);

						console.error(_context6.t0);
						process.exit(2);

					case 19:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, this, [[3, 15]]);
	}));

	return function foreverProcess(_x2) {
		return _ref2.apply(this, arguments);
	};
}();

var _arbiterUtil = require('arbiter-util');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }