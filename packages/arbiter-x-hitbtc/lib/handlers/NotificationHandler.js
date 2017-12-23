'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Ticker = require('../models/Ticker');

var _Ticker2 = _interopRequireDefault(_Ticker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var METHOD_ID = {
	ticker: 'ticker'
};

var NotificationHandler = function () {
	function NotificationHandler(event) {
		_classCallCheck(this, NotificationHandler);

		this.event = event;
	}

	_createClass(NotificationHandler, [{
		key: 'ticker',
		value: function ticker(data) {
			this.event['ticker'](new _Ticker2.default(data));
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
				case METHOD_ID.ticker:
					{
						this.ticker(params);
						return true;
					}
				default:
					return false;
			}
		}
	}]);

	return NotificationHandler;
}();

exports.default = NotificationHandler;