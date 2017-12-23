'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EVENT_ID = exports.EVENT_ID = {
	// Response events, ID matters
	balance: 0,
	auth: 1
};

var ResponseHandler = function () {
	function ResponseHandler(event) {
		_classCallCheck(this, ResponseHandler);

		this.event = event;
	}

	_createClass(ResponseHandler, [{
		key: 'balance',
		value: function balance(data) {
			this.event['balance'](data);
		}
	}, {
		key: 'auth',
		value: function auth(data) {
			this.event['auth'](data);
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
				case EVENT_ID.balance:
					{
						this.balance(result);
						return true;
					}
				case EVENT_ID.auth:
					{
						this.auth(result);
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