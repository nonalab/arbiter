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

		this.methodId = {
			ticker: 'ticker'
		};
	}

	_createClass(SnapshotHandler, [{
		key: 'ticker',
		value: function ticker(data) {
			this.event['ticker'](new _arbiterModel.Ticker(data));
		}
	}, {
		key: 'evaluate',
		value: function evaluate(_ref) {
			var method = _ref.method,
			    params = _ref.params;

			if (!method) {
				return false;
			}

			switch (method) {
				case this.methodId.ticker:
					{
						this.ticker(params);
						return true;
					}
				default:
					return false;
			}
		}
	}]);

	return SnapshotHandler;
}();

exports.default = SnapshotHandler;