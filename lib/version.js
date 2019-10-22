"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = version;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

var readFile = _fs.promises.readFile;

function version() {
  return _version.apply(this, arguments);
}

function _version() {
  _version = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var pkg;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return readFile(_path["default"].join(__dirname, '..', 'package.json'), 'utf8');

          case 2:
            pkg = _context.sent;
            console.log(__dirname);
            return _context.abrupt("return", 'v' + JSON.parse(pkg).version);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _version.apply(this, arguments);
}