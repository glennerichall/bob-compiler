"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResultParser = exports.ErrorParser = exports.TagParser = exports.Parser = void 0;

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Parser =
/*#__PURE__*/
function () {
  function Parser(pattern, options) {
    (0, _classCallCheck2["default"])(this, Parser);
    this.pattern = pattern;
    this.options = options || {};
    this.options.transformers = this.options.transformers || {};
  }

  (0, _createClass2["default"])(Parser, [{
    key: "parse",
    value: function parse(text) {
      var transformers = this.options.transformers;
      var matches = this.pattern.exec(text);

      if (matches) {
        var range = _objectSpread({
          matches: Array.from(matches)
        }, matches.groups, {
          first: matches.index,
          last: matches.index + matches[0].length - 1
        });

        for (var key in range) {
          if (transformers[key]) {
            range[key] = transformers[key](range[key]);
          }
        }

        return range;
      }

      return null;
    }
  }]);
  return Parser;
}();

exports.Parser = Parser;
var prefixPattern = '(?<prefix><!--|\\/\\*)\\s*';
var suffixPattern = '\\s*(?<suffix>-->|\\*\\/)';
var tagPlaceholder = '{tag}';
var anythingThatFollowsPattern = '.*';
var tagPattern = "".concat(prefixPattern, "(?<tag>").concat(tagPlaceholder, ")(?<content>").concat(anythingThatFollowsPattern, ")").concat(suffixPattern);

var TagParser =
/*#__PURE__*/
function (_Parser) {
  (0, _inherits2["default"])(TagParser, _Parser);

  function TagParser(pattern, options) {
    (0, _classCallCheck2["default"])(this, TagParser);
    var transformers = {
      content: function content(_content) {
        return _content.trim();
      }
    };
    options = options || {
      transformers: {}
    };
    options.transformers = _objectSpread({}, transformers, {}, options.transformers);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TagParser).call(this, new RegExp(tagPattern.replace(tagPlaceholder, pattern), 'g'), options));
  }

  return TagParser;
}(Parser);

exports.TagParser = TagParser;
var errorTagPattern = "".concat(tagPlaceholder, "\\s*\\((?<id>\\d+)\\)");

var ErrorParser =
/*#__PURE__*/
function (_TagParser) {
  (0, _inherits2["default"])(ErrorParser, _TagParser);

  function ErrorParser(tag) {
    (0, _classCallCheck2["default"])(this, ErrorParser);
    var transformers = {
      id: function id(_id) {
        return Number.parseInt(_id);
      }
    };
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ErrorParser).call(this, tag instanceof RegExp ? tag : errorTagPattern.replace(tagPlaceholder, tag), {
      transformers: transformers
    }));
  }

  return ErrorParser;
}(TagParser);

exports.ErrorParser = ErrorParser;
var numPattern = '(?<{name}>\\d+(\\.\\d+){0,1})';
var resultPattern = "".concat(tagPlaceholder, "\\s*").concat(numPattern.replace('{name}', 'result'), "/").concat(numPattern.replace('{name}', 'points'));

var ResultParser =
/*#__PURE__*/
function (_TagParser2) {
  (0, _inherits2["default"])(ResultParser, _TagParser2);

  function ResultParser(_tag) {
    (0, _classCallCheck2["default"])(this, ResultParser);
    var transformers = {
      points: function points(value) {
        return Number.parseFloat(value);
      },
      result: function result(value) {
        return Number.parseFloat(value);
      },
      tag: function tag(value) {
        return _tag;
      }
    };
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ResultParser).call(this, resultPattern.replace(tagPlaceholder, _tag), {
      transformers: transformers
    }));
  }

  return ResultParser;
}(TagParser);

exports.ResultParser = ResultParser;