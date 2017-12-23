'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _SnapshotHandler = require('./handlers/SnapshotHandler');

var _SnapshotHandler2 = _interopRequireDefault(_SnapshotHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EVENTS = ['auth', 'ticker', 'balance', 'close', 'other'];

var ArbiterExchangeBitFinex = function () {
	function ArbiterExchangeBitFinex() {
		var _this = this;

		var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wss://api.bitfinex.com/ws/2';

		_classCallCheck(this, ArbiterExchangeBitFinex);

		this.event = {};

		EVENTS.map(function (name) {
			return _this.event[name] = function () {};
		});

		var wsClient = this.wsClient = new _ws2.default(baseUrl, {
			perMessageDeflate: false
		});

		var snapshotHandler = new _SnapshotHandler2.default(this.event);

		// Handle message and ping the appropriate
		// litener from the container
		wsClient.on('message', function (resp) {
			var respJSON = JSON.parse(resp);

			if (respJSON.event) {
				snapshotHandler.register(respJSON);
				return;
			}

			if (snapshotHandler.evaluate(respJSON)) return;

			_this.event['other'](respJSON);
		});

		wsClient.on('close', this.event['close']);
	}

	_createClass(ArbiterExchangeBitFinex, [{
		key: 'on',
		value: function on(eventName, callback) {
			this.event[eventName] = callback;
			return this;
		}
	}, {
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
	}, {
		key: 'subscribeToTicker',
		value: function subscribeToTicker() {
			var rawSymbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ETHUSD";

			var event = "subscribe";

			var channel = "ticker";

			var symbol = 't' + rawSymbol;

			var socketMessage = { event: event, channel: channel, symbol: symbol };

			this.wsClient.send(JSON.stringify(socketMessage));
		}
	}, {
		key: 'authenticate',
		value: function authenticate(_ref2) {
			var key = _ref2.key,
			    secret = _ref2.secret;

			var event = "auth";

			var method = "login";

			var nonce = Date.now() + Math.random().toString();

			var payload = 'AUTH' + nonce;

			var signature = _cryptoJs2.default.HmacSHA384(payload, secret).toString(_cryptoJs2.default.enc.Hex);

			var socketMessage = {
				event: event,
				apiKey: key,
				authSig: signature,
				authNonce: nonce,
				authPayload: payload
			};

			this.wsClient.send(JSON.stringify(socketMessage));
		}
	}]);

	return ArbiterExchangeBitFinex;
}();

exports.default = ArbiterExchangeBitFinex;