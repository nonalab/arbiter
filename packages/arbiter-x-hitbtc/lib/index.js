'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _arbiterUtils = require('arbiter-utils');

var _ResponseHandler = require('./handlers/ResponseHandler');

var _ResponseHandler2 = _interopRequireDefault(_ResponseHandler);

var _SnapshotHandler = require('./handlers/SnapshotHandler');

var _SnapshotHandler2 = _interopRequireDefault(_SnapshotHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArbiterExchangeHitBTC = function (_EventEmitter) {
	_inherits(ArbiterExchangeHitBTC, _EventEmitter);

	function ArbiterExchangeHitBTC() {
		var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wss://api.hitbtc.com/api/2/ws';

		_classCallCheck(this, ArbiterExchangeHitBTC);

		var _this = _possibleConstructorReturn(this, (ArbiterExchangeHitBTC.__proto__ || Object.getPrototypeOf(ArbiterExchangeHitBTC)).call(this));

		var wsClient = _this.wsClient = new _ws2.default(baseUrl, {
			perMessageDeflate: false
		});

		var responseHandler = new _ResponseHandler2.default(_this);

		var snapshotHandler = new _SnapshotHandler2.default(_this);

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', function (resp) {
			var respJSON = JSON.parse(resp);

			if (responseHandler.evaluate(respJSON)) return;

			if (snapshotHandler.evaluate(respJSON)) return;

			_this.emit('other', respJSON);
		});

		wsClient.on('close', function () {
			return _this.emit('close');
		});
		return _this;
	}

	_createClass(ArbiterExchangeHitBTC, [{
		key: 'open',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
				var wsClient;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								wsClient = this.wsClient;
								return _context.abrupt('return', new Promise(function (resolve, reject) {
									wsClient.on('open', function () {
										return resolve();
									});
								}));

							case 2:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function open() {
				return _ref.apply(this, arguments);
			}

			return open;
		}()
	}, {
		key: 'send',
		value: function send(socketMessage) {
			if (!socketMessage) return;
			this.wsClient.send(JSON.stringify(socketMessage));
		}

		/* Streaming APIs: */

	}, {
		key: 'subscribeToReports',
		value: function subscribeToReports() {
			this.send({
				method: 'subscribeReports',
				params: {}
			});
		}
	}, {
		key: 'subscribeToTicker',
		value: function subscribeToTicker() {
			var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ETHUSD';

			this.send({
				method: 'subscribeTicker',
				params: {
					symbol: symbol
				}
			});
		}

		/* REST-like APIs: */

	}, {
		key: 'makeOrderParams',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(side, symbol, quantity, price) {
				var clientOrderId, params;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return (0, _arbiterUtils.generateOrderId)();

							case 2:
								clientOrderId = _context2.sent;
								params = {
									side: side,
									symbol: symbol,
									quantity: quantity,
									clientOrderId: clientOrderId
								};


								if (!price) {
									params.type = 'market';
									params.timeInForce = 'IOC';
								} else {
									params.price = price;
								}

								return _context2.abrupt('return', params);

							case 6:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function makeOrderParams(_x3, _x4, _x5, _x6) {
				return _ref2.apply(this, arguments);
			}

			return makeOrderParams;
		}()
	}, {
		key: 'requestBuyOrder',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
				var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ETHUSD';
				var quantity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.01;
				var price = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
				var params, self;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return this.makeOrderParams('buy', symbol, quantity, price);

							case 2:
								params = _context3.sent;


								this.send({
									id: 'buy',
									method: 'newOrder',
									params: params
								});

								self = this;
								return _context3.abrupt('return', new Promise(function (resolve, reject) {
									self.on('buy', function (data) {
										if (data.clientOrderId === params.clientOrderId) {
											resolve(data);
										}
									});
								}));

							case 6:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function requestBuyOrder() {
				return _ref3.apply(this, arguments);
			}

			return requestBuyOrder;
		}()
	}, {
		key: 'requestSellOrder',
		value: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
				var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ETHUSD';
				var quantity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.01;
				var price = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
				var params, self;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return this.makeOrderParams('sell', symbol, quantity, price);

							case 2:
								params = _context4.sent;


								this.send({
									id: 'sell',
									method: 'newOrder',
									params: params
								});

								self = this;
								return _context4.abrupt('return', new Promise(function (resolve, reject) {
									self.on('sell', function (data) {
										if (data.clientOrderId === params.clientOrderId) {
											resolve(data);
										}
									});
								}));

							case 6:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function requestSellOrder() {
				return _ref4.apply(this, arguments);
			}

			return requestSellOrder;
		}()
	}, {
		key: 'requestCancelOrder',
		value: function requestCancelOrder(clientOrderId) {
			this.send({
				id: 'cancel',
				method: 'cancelOrder',
				params: {
					clientOrderId: clientOrderId
				}
			});
		}
	}, {
		key: 'requestTradingBalance',
		value: function requestTradingBalance() {
			this.send({
				id: 'balance',
				method: 'getTradingBalance',
				params: {}
			});
		}
	}, {
		key: 'authenticate',
		value: function () {
			var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref5) {
				var key = _ref5.key,
				    secret = _ref5.secret;
				var self, id, method, algo, nonce, signature;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								self = this;
								id = 'auth';
								method = 'login';
								algo = 'HS256';

								// Authentication using sha256 is something boggling :O

								nonce = Date.now() + Math.random().toString();
								signature = _crypto2.default.createHmac('sha256', secret).update(nonce).digest('hex');


								this.send({
									id: id,
									method: method,
									params: {
										algo: algo,
										pKey: key,
										nonce: nonce,
										signature: signature
									}
								});

								return _context5.abrupt('return', new Promise(function (resolve, reject) {
									self.on('auth', function (data) {
										return data ? resolve() : reject();
									});
								}));

							case 8:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function authenticate(_x13) {
				return _ref6.apply(this, arguments);
			}

			return authenticate;
		}()
	}]);

	return ArbiterExchangeHitBTC;
}(_events2.default);

exports.default = ArbiterExchangeHitBTC;