'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArbiterStore = function () {
	function ArbiterStore() {
		var _this = this;

		var dbFiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['credential', 'pairs', 'price'];
		var dbPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '../db';

		_classCallCheck(this, ArbiterStore);

		this.date = Date.now();

		this.path = {};

		dbFiles.map(function (file) {
			_this.path[file] = _path2.default.resolve(__dirname, dbPath + '/' + file + '.json');
		});

		this.dbFiles = dbFiles;
	}

	_createClass(ArbiterStore, [{
		key: 'init',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
				var _this2 = this;

				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								return _context2.abrupt('return', Promise.all(this.dbFiles.map(function () {
									var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file) {
										return regeneratorRuntime.wrap(function _callee$(_context) {
											while (1) {
												switch (_context.prev = _context.next) {
													case 0:
														_context.next = 2;
														return _fsExtra2.default.readJson(_this2.path[file]);

													case 2:
														_this2[file] = _context.sent;

													case 3:
													case 'end':
														return _context.stop();
												}
											}
										}, _callee, _this2);
									}));

									return function (_x3) {
										return _ref2.apply(this, arguments);
									};
								}())));

							case 1:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function init() {
				return _ref.apply(this, arguments);
			}

			return init;
		}()

		// This log the data to the desired file

	}, {
		key: 'log',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(file) {
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								return _context3.abrupt('return', _fsExtra2.default.writeJson(this.path[file], this[file], { spaces: 2 }));

							case 1:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function log(_x4) {
				return _ref3.apply(this, arguments);
			}

			return log;
		}()

		// This cache the data into memory in a key/value fashion

	}, {
		key: 'cacheKeyValue',
		value: function cacheKeyValue(file, key, value) {
			if (!this[file] || !this[file][key]) {
				return;
			}
			this[file][key] = value;
		}
	}]);

	return ArbiterStore;
}();

exports.default = ArbiterStore;