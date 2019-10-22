"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _editor = require("./editor.js");

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var writeFile = _fs.promises.writeFile,
    readFile = _fs.promises.readFile;

var Document =
/*#__PURE__*/
function () {
  function Document(filename) {
    (0, _classCallCheck2["default"])(this, Document);
    this.filename = filename;
    this.content = null;
    this.lang = _path["default"].extname(filename).replace('.', '');
  }

  (0, _createClass2["default"])(Document, [{
    key: "load",
    value: function () {
      var _load = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return readFile(this.filename, 'utf8');

              case 2:
                this.content = _context.sent;

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function load() {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: "edit",
    value: function () {
      var _edit = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(edition) {
        var editor;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                editor = new _editor.Editor(this);
                _context2.next = 3;
                return edition(editor);

              case 3:
                if (!_context2.sent) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 6;
                return editor.done();

              case 6:
                this.modified = true;

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function edit(_x) {
        return _edit.apply(this, arguments);
      }

      return edit;
    }()
  }, {
    key: "saveAs",
    value: function () {
      var _saveAs = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(filename) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.modified) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", Promise.resolve(false));

              case 2:
                _context3.next = 4;
                return writeFile(filename, this.content, 'utf8');

              case 4:
                return _context3.abrupt("return", Promise.resolve(true));

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function saveAs(_x2) {
        return _saveAs.apply(this, arguments);
      }

      return saveAs;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", this.saveAs(this.filename));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function save() {
        return _save.apply(this, arguments);
      }

      return save;
    }()
  }]);
  return Document;
}();

exports.Document = Document;