'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arbiterModel = require('arbiter-model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SnapshotHandler = function () {
	function SnapshotHandler(event) {
		_classCallCheck(this, SnapshotHandler);

		this.event = event;

		this.channelType = {
			ticker: 'ticker'
		};

		this.channelMap = {};
	}

	_createClass(SnapshotHandler, [{
		key: 'register',
		value: function register(_ref) {
			var channel = _ref.channel,
			    chanId = _ref.chanId,
			    pair = _ref.pair;

			this.channelMap[chanId] = {
				channel: channel,
				pair: pair
			};
		}
	}, {
		key: 'ticker',
		value: function ticker(pair, _ref2) {
			var _ref3 = _slicedToArray(_ref2, 10),
			    bid = _ref3[0],
			    bidSize = _ref3[1],
			    ask = _ref3[2],
			    askSize = _ref3[3],
			    dailyChange = _ref3[4],
			    dailyChangePerc = _ref3[5],
			    last = _ref3[6],
			    volume = _ref3[7],
			    high = _ref3[8],
			    low = _ref3[9];

			this.event['ticker'](new _arbiterModel.Ticker({
				symbol: pair,
				bid: bid,
				ask: ask,
				last: last,
				low: low,
				high: high,
				volume: volume
			}));
		}
	}, {
		key: 'evaluate',
		value: function evaluate(_ref4) {
			var _ref5 = _slicedToArray(_ref4, 2),
			    chanId = _ref5[0],
			    data = _ref5[1];

			if (typeof data === 'string' || data.length < 2) {
				return false;
			}

			var _channelMap$chanId = this.channelMap[chanId],
			    channel = _channelMap$chanId.channel,
			    pair = _channelMap$chanId.pair;


			switch (channel) {
				case this.channelType.ticker:
					{
						this.ticker(pair, data);
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