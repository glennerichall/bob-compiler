"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompilationGroup = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _compiler = require("./compiler.js");

var SubCompiler =
/*#__PURE__*/
function (_Compiler) {
  (0, _inherits2["default"])(SubCompiler, _Compiler);

  function SubCompiler(file, database, group) {
    var _this;

    (0, _classCallCheck2["default"])(this, SubCompiler);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SubCompiler).call(this, file, database));
    _this.group = group;
    return _this;
  }

  (0, _createClass2["default"])(SubCompiler, [{
    key: "updateResult",
    value: function () {
      var _updateResult = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(editor, sum) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.group.sync(sum);

              case 2:
                sum = _context.sent;
                _context.next = 5;
                return (0, _get2["default"])((0, _getPrototypeOf2["default"])(SubCompiler.prototype), "updateResult", this).call(this, editor, sum);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function updateResult(_x, _x2) {
        return _updateResult.apply(this, arguments);
      }

      return updateResult;
    }()
  }]);
  return SubCompiler;
}(_compiler.Compiler);

var CompilationGroup =
/*#__PURE__*/
function () {
  function CompilationGroup(files, database) {
    var _this2 = this;

    (0, _classCallCheck2["default"])(this, CompilationGroup);
    this.compilers = files.map(function (file) {
      return new SubCompiler(file, database, _this2);
    });
  }

  (0, _createClass2["default"])(CompilationGroup, [{
    key: "sync",
    value: function () {
      var _sync = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(sum) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.count++;
                this.sum += sum;

                if (this.count >= this.compilers.length) {
                  this.resolve(this.sum);
                }

                return _context2.abrupt("return", this.syncPromise);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function sync(_x3) {
        return _sync.apply(this, arguments);
      }

      return sync;
    }()
  }, {
    key: "load",
    value: function () {
      var _load = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3() {
        var promises;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                promises = this.compilers.map(function (compiler) {
                  return compiler.load();
                });
                _context3.next = 3;
                return Promise.all(promises);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function load() {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: "execute",
    value: function () {
      var _execute = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        var _this3 = this;

        var promises;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.count = 0;
                this.sum = 0;
                this.syncPromise = new Promise(function (resolve, reject) {
                  _this3.resolve = resolve;
                });
                promises = this.compilers.map(function (compiler) {
                  return compiler.execute();
                });
                _context4.next = 6;
                return Promise.all(promises);

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function execute() {
        return _execute.apply(this, arguments);
      }

      return execute;
    }()
  }]);
  return CompilationGroup;
}();

exports.CompilationGroup = CompilationGroup;