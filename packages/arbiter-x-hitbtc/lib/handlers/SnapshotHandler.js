'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arbiterModel = require('arbiter-model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SnapshotHandler = function () {
	function SnapshotHandler(event) {
		_classCallCheck(this, SnapshotHandler);

		this.event = event;
	}

	/*
 {"channel":"ticker","type":"update","data":{"ask":"0.053440","bid":"0.053341","last":"0.053445","open":"0.049779","low":"0.046764","high":"0.054361","volume":"115040.853","volumeQuote":"5872.911384124","timestamp":"2017-11-13T02:45:14.146Z","symbol":"ETHBTC"}}
 */


	_createClass(SnapshotHandler, [{
		key: 'ticker',
		value: function ticker(data) {
			this.event['ticker'](new _arbiterModel.Ticker(data));
		}
	}, {
		key: 'activeOrders',
		value: function activeOrders(data) {
			this.event['order'](data);
		}
	}, {
		key: 'evaluate',
		value: function evaluate(_ref) {
			var method = _ref.method,
			    params = _ref.params;

			if (!method || !this[method]) {
				return false;
			}

			this[method](params);

			return true;
		}
	}]);

	return SnapshotHandler;
}();

exports.default = SnapshotHandler;