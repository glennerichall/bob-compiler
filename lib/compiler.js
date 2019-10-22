"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compiler = exports.ResultComment = exports.ErrorComment = exports.Comment = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _parser = require("./parser.js");

var _comments = require("./comments.js");

var _document = require("./document.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Comment =
/*#__PURE__*/
function () {
  function Comment(range) {
    (0, _classCallCheck2["default"])(this, Comment);
    this.range = range;
  }

  (0, _createClass2["default"])(Comment, [{
    key: "update",
    value: function update(editor, content) {
      if (this.range.first == this.range.last) {
        editor.insertPosition(this.range.first, this.getText(content) + '\n');
      } else {
        editor.replaceRange(this.range, this.getText(content));
      }
    }
  }, {
    key: "getText",
    value: function getText() {}
  }]);
  return Comment;
}();

exports.Comment = Comment;

var ErrorComment =
/*#__PURE__*/
function (_Comment) {
  (0, _inherits2["default"])(ErrorComment, _Comment);

  function ErrorComment(range) {
    (0, _classCallCheck2["default"])(this, ErrorComment);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ErrorComment).call(this, range));
  }

  (0, _createClass2["default"])(ErrorComment, [{
    key: "getText",
    value: function getText(content) {
      var _this$range = this.range,
          tag = _this$range.tag,
          prefix = _this$range.prefix,
          suffix = _this$range.suffix,
          points = _this$range.points;
      var card = points > 1 ? 's' : '';
      var template = "".concat(prefix, " ").concat(tag, " ").concat(content, ", (").concat(points, " point").concat(card, ") ").concat(suffix);
      return template;
    }
  }]);
  return ErrorComment;
}(Comment);

exports.ErrorComment = ErrorComment;

var ResultComment =
/*#__PURE__*/
function (_Comment2) {
  (0, _inherits2["default"])(ResultComment, _Comment2);

  function ResultComment(range) {
    (0, _classCallCheck2["default"])(this, ResultComment);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ResultComment).call(this, range));
  }

  (0, _createClass2["default"])(ResultComment, [{
    key: "getText",
    value: function getText(sum) {
      var _this$range2 = this.range,
          tag = _this$range2.tag,
          prefix = _this$range2.prefix,
          suffix = _this$range2.suffix,
          max = _this$range2.max;
      var template = "".concat(prefix, " ").concat(tag, " ").concat(max - sum, "/").concat(max, " ").concat(suffix);
      return template;
    }
  }]);
  return ResultComment;
}(Comment);

exports.ResultComment = ResultComment;

var Compiler =
/*#__PURE__*/
function () {
  function Compiler(filename, database) {
    (0, _classCallCheck2["default"])(this, Compiler);
    this.document = new _document.Document(filename);
    this.database = database instanceof _comments.CommentList ? database : new _comments.CommentList(database);
    this.comments = [];
  }

  (0, _createClass2["default"])(Compiler, [{
    key: "load",
    value: function () {
      var _load = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var content, parser, range, tag, fix, r;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.document.load();

              case 2:
                _context.next = 4;
                return this.database.load();

              case 4:
                content = this.document.content;
                parser = new _parser.ErrorParser('Err:');

                while (range = parser.parse(content)) {
                  this.comments.push(new ErrorComment(range));
                }

                tag = 'Résultat:';
                fix = (0, _comments.getDefaultFix)(this.document.lang);
                r = new _parser.ResultParser(tag).parse(content) || _objectSpread({
                  first: 0,
                  last: 0
                }, fix);
                r = _objectSpread({}, r, {
                  max: this.database.total.points,
                  tag: tag
                });
                this.resultComment = new ResultComment(r);

              case 12:
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
    key: "updateErrors",
    value: function () {
      var _updateErrors = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(editor) {
        var sum, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, comment, id, _this$database$commen, content, points;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                sum = 0;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 4;

                for (_iterator = this.comments[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  comment = _step.value;
                  id = comment.range.id;
                  _this$database$commen = this.database.comments[id], content = _this$database$commen.content, points = _this$database$commen.points;
                  comment.range.points = points;
                  sum += points;
                  comment.update(editor, content);
                }

                _context2.next = 12;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 12:
                _context2.prev = 12;
                _context2.prev = 13;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 15:
                _context2.prev = 15;

                if (!_didIteratorError) {
                  _context2.next = 18;
                  break;
                }

                throw _iteratorError;

              case 18:
                return _context2.finish(15);

              case 19:
                return _context2.finish(12);

              case 20:
                return _context2.abrupt("return", sum);

              case 21:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 8, 12, 20], [13,, 15, 19]]);
      }));

      function updateErrors(_x) {
        return _updateErrors.apply(this, arguments);
      }

      return updateErrors;
    }()
  }, {
    key: "updateResult",
    value: function () {
      var _updateResult = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(editor, sum) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.resultComment.update(editor, sum);

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function updateResult(_x2, _x3) {
        return _updateResult.apply(this, arguments);
      }

      return updateResult;
    }()
  }, {
    key: "execute",
    value: function () {
      var _execute = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5() {
        var _this = this;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.document.edit(
                /*#__PURE__*/
                function () {
                  var _ref = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee4(editor) {
                    var sum;
                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.next = 2;
                            return _this.updateErrors(editor);

                          case 2:
                            sum = _context4.sent;
                            _context4.next = 5;
                            return _this.updateResult(editor, sum);

                          case 5:
                            return _context4.abrupt("return", true);

                          case 6:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x4) {
                    return _ref.apply(this, arguments);
                  };
                }());

              case 2:
                _context5.next = 4;
                return this.document.save();

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function execute() {
        return _execute.apply(this, arguments);
      }

      return execute;
    }()
  }]);
  return Compiler;
}();

exports.Compiler = Compiler;