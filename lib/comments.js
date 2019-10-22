"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultFix = getDefaultFix;
exports.CommentList = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _parser = require("./parser.js");

function _wrapRegExp(re, groups) { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, undefined, groups); }; var _RegExp = (0, _wrapNativeSuper2["default"])(RegExp); var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = _RegExp.call(this, re, flags); _groups.set(_this, groups || _groups.get(re)); return _this; } (0, _inherits2["default"])(BabelRegExp, _RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = []; args.push.apply(args, arguments); if ((0, _typeof2["default"])(args[args.length - 1]) !== "object") { args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }

var exists = _util["default"].promisify(_fs["default"].exists);

var readFile = _util["default"].promisify(_fs["default"].readFile);

var CommentDbParser =
/*#__PURE__*/
function (_ErrorParser) {
  (0, _inherits2["default"])(CommentDbParser, _ErrorParser);

  function CommentDbParser(tag) {
    var _this;

    (0, _classCallCheck2["default"])(this, CommentDbParser);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CommentDbParser).call(this, tag));
    var pattern = '\\s*(?<points>\\d+(\\.\\d+){0,1})\\s*' + _this.pattern.source;
    _this.pattern = new RegExp(pattern, 'g');

    _this.options.transformers.points = function (value) {
      return Number.parseFloat(value);
    };

    return _this;
  }

  return CommentDbParser;
}(_parser.ErrorParser);

var CommentList =
/*#__PURE__*/
function () {
  function CommentList(filename) {
    (0, _classCallCheck2["default"])(this, CommentList);
    this.filename = filename;
    this.comments = null;
  }

  (0, _createClass2["default"])(CommentList, [{
    key: "load",
    value: function () {
      var _load = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var content, parser, comment;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.comments != null)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _context.next = 4;
                return readFile(this.filename);

              case 4:
                content = _context.sent;
                parser = new CommentDbParser('Err:');
                this.comments = [];

                while ((comment = parser.parse(content)) != null) {
                  this.comments[comment.id] = comment;
                }

                this.total = new _parser.Parser(_wrapRegExp(/Total:[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9]+)/g, {
                  points: 1
                }), {
                  transformers: {
                    points: function points(value) {
                      return Number.parseInt(value);
                    }
                  }
                }).parse(content);

              case 9:
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
  }]);
  return CommentList;
}();

exports.CommentList = CommentList;

function getDefaultFix(lang) {
  var prefix, suffix;

  if (lang == 'js' || lang == 'css') {
    prefix = '/*';
    suffix = '*/';
  } else if (lang == 'html') {
    prefix = '<!--';
    suffix = '-->';
  }

  return {
    prefix: prefix,
    suffix: suffix
  };
}