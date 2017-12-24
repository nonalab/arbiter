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

var _ResponseHandler = require('./handlers/ResponseHandler');

var _ResponseHandler2 = _interopRequireDefault(_ResponseHandler);

var _SnapshotHandler = require('./handlers/SnapshotHandler');

var _SnapshotHandler2 = _interopRequireDefault(_SnapshotHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EVENTS = ['auth', 'order', 'ticker', 'balance', 'close', 'other'];

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

			_this.event['other'](respJSON);
		});

		wsClient.on('close', _this.event['close']);
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
										resolve();
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

		/* Streaming APIs: */

	}, {
		key: 'subscribeToReports',
		value: function subscribeToReports() {
			var method = "subscribeReports";

			var socketMessage = {
				method: method,
				params: {}
			};

			this.wsClient.send(JSON.stringify(socketMessage));
		}
	}, {
		key: 'subscribeToTicker',
		value: function subscribeToTicker() {
			var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ETHUSD";

			var method = "subscribeTicker";

			var socketMessage = {
				method: method,
				params: {
					symbol: symbol
				}
			};

			this.wsClient.send(JSON.stringify(socketMessage));
		}

		/* REST-like APIs: */

	}, {
		key: 'sendRequest',
		value: function sendRequest(socketMessage) {
			this.wsClient.send(JSON.stringify(socketMessage));
		}
	}, {
		key: 'requestBuyOrder',
		value: function requestBuyOrder(clientOrderId, symbol, price, quantity) {
			this.sendRequest({
				id: _ResponseHandler.EVENT_ID.sell,
				method: "newOrder",
				params: {
					side: "buy",
					clientOrderId: clientOrderId,
					symbol: symbol,
					price: price,
					quantity: quantity
				}
			});
		}
	}, {
		key: 'requestSellOrder',
		value: function requestSellOrder(clientOrderId, symbol, price, quantity) {
			this.sendRequest({
				id: _ResponseHandler.EVENT_ID.sell,
				method: "newOrder",
				params: {
					side: "sell",
					clientOrderId: clientOrderId,
					symbol: symbol,
					price: price,
					quantity: quantity
				}
			});
		}
	}, {
		key: 'requestCancelOrder',
		value: function requestCancelOrder(clientOrderId) {
			this.sendRequest({
				id: _ResponseHandler.EVENT_ID.cancel,
				method: "cancelOrder",
				params: {
					clientOrderId: clientOrderId
				}
			});
		}
	}, {
		key: 'requestTradingBalance',
		value: function requestTradingBalance() {
			this.sendRequest({
				id: _ResponseHandler.EVENT_ID.balance,
				method: "getTradingBalance",
				params: {}
			});
		}
	}, {
		key: 'authenticate',
		value: function authenticate(_ref2) {
			var key = _ref2.key,
			    secret = _ref2.secret;

			var id = _ResponseHandler.EVENT_ID.auth;

			var method = "login";

			var algo = "HS256";

			// Authentication using sha256 is something boggling :O
			var nonce = Date.now() + Math.random().toString();

			var signature = _crypto2.default.createHmac('sha256', secret).update(nonce).digest('hex');

			this.sendRequest({
				id: id,
				method: method,
				params: {
					algo: algo,
					pKey: key,
					nonce: nonce,
					signature: signature
				}
			});

			var self = this;

			return new Promise(function (resolve, reject) {
				self.once('auth', function (data) {
					console.log(data);
					resolve();
				});
			});
		}
	}]);

	return ArbiterExchangeHitBTC;
}(_events2.default);

exports.default = ArbiterExchangeHitBTC;