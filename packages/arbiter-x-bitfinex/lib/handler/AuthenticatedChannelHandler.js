'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = require('../model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthenticatedChannelHandler = function () {
	function AuthenticatedChannelHandler(event) {
		_classCallCheck(this, AuthenticatedChannelHandler);

		this.event = event;

		this.channelMap = {};
		this.channelMap[0] = 'auth';
	}

	_createClass(AuthenticatedChannelHandler, [{
		key: 'register',
		value: function register(_ref) {
			var chanId = _ref.chanId,
			    channel = _ref.channel;

			this.channelMap[chanId] = channel;
		}
	}, {
		key: 'balance',
		value: function balance(data) {
			var validBalances = data.filter(function (_ref2) {
				var _ref3 = _slicedToArray(_ref2, 1),
				    type = _ref3[0];

				return type === 'exchange';
			}).map(function (item) {
				return new _model.Balance(item);
			});

			this.event.emit('balance', validBalances);
		}
	}, {
		key: 'auth',
		value: function auth(chanSymbol, data) {

			switch (chanSymbol) {
				case 'ws':
					this.event.emit('auth');

					return true;
				case 'ps':

					return true;
				case 'os':

					return true;
				default:
					return false;
			}
		}
	}, {
		key: 'evaluate',
		value: function evaluate(_ref4) {
			var _ref5 = _slicedToArray(_ref4, 3),
			    chanId = _ref5[0],
			    chanSymbol = _ref5[1],
			    data = _ref5[2];

			var channel = this.channelMap[chanId];

			if (!this[channel]) {
				return false;
			}

			return this[channel](chanSymbol, data);
		}
	}]);

	return AuthenticatedChannelHandler;
}();

exports.default = AuthenticatedChannelHandler;