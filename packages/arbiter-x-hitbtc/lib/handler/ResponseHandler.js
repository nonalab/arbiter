'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arbiterModel = require('arbiter-model');

var _model = require('../model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResponseHandler = function () {
	function ResponseHandler(event) {
		_classCallCheck(this, ResponseHandler);

		this.event = event;
	}

	_createClass(ResponseHandler, [{
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
		key: 'buy',
		value: function buy(data) {
			this.event.emit('buy', new _model.Order(data));
		}
	}, {
		key: 'sell',
		value: function sell(data) {
			this.event.emit('sell', new _model.Order(data));
		}
	}, {
		key: 'cancel',
		value: function cancel(data) {
			this.event.emit('cancel', data);
		}
	}, {
		key: 'evaluate',
		value: function evaluate(_ref) {
			var id = _ref.id,
			    result = _ref.result,
			    error = _ref.error;

			if (!id || !this[id]) {
				return false;
			}

			if (error) {
				this.event.emit('error', error);
			} else {
				this[id](result);
			}

			return true;
		}
	}]);

	return ResponseHandler;
}();

exports.default = ResponseHandler;