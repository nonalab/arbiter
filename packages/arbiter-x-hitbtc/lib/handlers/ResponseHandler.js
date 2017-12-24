'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EVENT_ID = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arbiterModel = require('arbiter-model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EVENT_ID = exports.EVENT_ID = {
	// Response events, ID matters
	auth: 0,
	balance: 1,
	buy: 2,
	sell: 3,
	cancel: 4,
	activeOrders: 5
};

var ResponseHandler = function () {
	function ResponseHandler(event) {
		_classCallCheck(this, ResponseHandler);

		this.event = event;
		this.eventId = Object.assign({}, EVENT_ID);
	}

	_createClass(ResponseHandler, [{
		key: 'activeOrders',
		value: function activeOrders(data) {
			this.event.emit('order', data);
		}
	}, {
		key: 'balance',
		value: function balance(data) {
			var validBalances = data.map(function (item) {
				return new _arbiterModel.Balance(item);
			}).filter(function (balance) {
				return balance.isFunded();
			});

			this.event.emit('balance', validBalances);
		}
	}, {
		key: 'auth',
		value: function auth(data) {
			this.event.emit('auth', data);
		}
	}, {
		key: 'evaluate',
		value: function evaluate(_ref) {
			var id = _ref.id,
			    result = _ref.result;

			if (!id) {
				return false;
			}

			switch (id) {
				case this.eventId.balance:
					{
						this.balance(result);
						return true;
					}
				case this.eventId.auth:
					{
						this.auth(result);
						return true;
					}
				case this.eventId.activeOrders:
					{
						this.activeOrders(result);
						return true;
					}
				default:
					return false;
			}
		}
	}]);

	return ResponseHandler;
}();

exports.default = ResponseHandler;