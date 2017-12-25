'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _PublicChannelHandler = require('./handler/PublicChannelHandler');

var _PublicChannelHandler2 = _interopRequireDefault(_PublicChannelHandler);

var _AuthenticatedChannelHandler = require('./handler/AuthenticatedChannelHandler');

var _AuthenticatedChannelHandler2 = _interopRequireDefault(_AuthenticatedChannelHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArbiterExchangeBitFinex = function (_EventEmitter) {
	_inherits(ArbiterExchangeBitFinex, _EventEmitter);

	function ArbiterExchangeBitFinex() {
		var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wss://api.bitfinex.com/ws/2';

		_classCallCheck(this, ArbiterExchangeBitFinex);

		var _this = _possibleConstructorReturn(this, (ArbiterExchangeBitFinex.__proto__ || Object.getPrototypeOf(ArbiterExchangeBitFinex)).call(this));

		var wsClient = _this.wsClient = new _ws2.default(baseUrl, {
			perMessageDeflate: false
		});

		var publicChannelHandler = new _PublicChannelHandler2.default(_this);

		var authenticatedChannelHandler = new _AuthenticatedChannelHandler2.default(_this);

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', function (resp) {
			var respJSON = JSON.parse(resp);

			if (respJSON.event) {
				return publicChannelHandler.register(respJSON);
			}

			if (publicChannelHandler.evaluate(respJSON)) return;

			if (authenticatedChannelHandler.evaluate(respJSON)) return;

			_this.emit('other', respJSON);
		});

		wsClient.on('close', function () {
			return _this.emit('close');
		});
		return _this;
	}

	_createClass(ArbiterExchangeBitFinex, [{
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
		key: 'subscribeToTicker',
		value: function subscribeToTicker() {
			var rawSymbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ETHUSD';

			this.send({
				event: 'subscribe',
				channel: 'ticker',
				symbol: 't' + rawSymbol
			});
		}
	}, {
		key: 'authenticate',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref2) {
				var key = _ref2.key,
				    secret = _ref2.secret;
				var self, event, nonce, payload, filter, signature;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								self = this;
								event = 'auth';
								nonce = Date.now() + Math.random().toString();
								payload = 'AUTH' + nonce;
								filter = ['trading', 'wallet', 'balance'];
								signature = _cryptoJs2.default.HmacSHA384(payload, secret).toString(_cryptoJs2.default.enc.Hex);


								this.send({
									event: event,
									filter: filter,
									apiKey: key,
									authSig: signature,
									authNonce: nonce,
									authPayload: payload
								});

								return _context2.abrupt('return', new Promise(function (resolve, reject) {
									self.on('auth', function (data) {
										return data ? resolve() : reject();
									});
								}));

							case 8:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function authenticate(_x3) {
				return _ref3.apply(this, arguments);
			}

			return authenticate;
		}()
	}]);

	return ArbiterExchangeBitFinex;
}(_events2.default);

exports.default = ArbiterExchangeBitFinex;