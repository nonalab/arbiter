'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Ticker = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _arbiterModel = require('arbiter-model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ticker = exports.Ticker = function (_DefaultTicker) {
	_inherits(Ticker, _DefaultTicker);

	function Ticker(symbol, _ref) {
		var _ref2 = _slicedToArray(_ref, 10),
		    bid = _ref2[0],
		    bidSize = _ref2[1],
		    ask = _ref2[2],
		    askSize = _ref2[3],
		    dailyChange = _ref2[4],
		    dailyChangePerc = _ref2[5],
		    last = _ref2[6],
		    volume = _ref2[7],
		    high = _ref2[8],
		    low = _ref2[9];

		_classCallCheck(this, Ticker);

		return _possibleConstructorReturn(this, (Ticker.__proto__ || Object.getPrototypeOf(Ticker)).call(this, {
			symbol: symbol,
			bid: bid,
			ask: ask,
			last: last,
			low: low,
			high: high,
			volume: volume
		}));
	}

	return Ticker;
}(_arbiterModel.Ticker);