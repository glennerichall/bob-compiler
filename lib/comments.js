"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultFix = getDefaultFix;
exports.CommentList = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _parser = require("./parser.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exists = _util.default.promisify(_fs.default.exists);

const readFile = _util.default.promisify(_fs.default.readFile);

class CommentDbParser extends _parser.ErrorParser {
  constructor(tag) {
    super(tag);
    let pattern = '\\s*(?<points>\\d+(\\.\\d+){0,1})\\s*' + this.pattern.source;
    this.pattern = new RegExp(pattern, 'g');

    this.options.transformers.points = value => Number.parseFloat(value);
  }

}

class CommentList {
  constructor(filename) {
    this.filename = filename;
    this.comments = null;
  }

  async load() {
    if (this.comments != null) return;
    let content = await readFile(this.filename);
    let parser = new CommentDbParser('Err:');
    let comment;
    this.comments = [];

    while ((comment = parser.parse(content)) != null) {
      this.comments[comment.id] = comment;
    }

    this.total = new _parser.Parser(/Total:\s*(?<points>\d+)/g, {
      transformers: {
        points: value => Number.parseInt(value)
      }
    }).parse(content);
  }

}

exports.CommentList = CommentList;

function getDefaultFix(lang) {
  let prefix, suffix;

  if (lang == 'js' || lang == 'css' || lang == 'cs' || lang == 'cpp' || lang == 'c' || lang == 'c++' || lang == 'java') {
    prefix = '/*';
    suffix = '*/';
  } else if (lang == 'html' || lang == 'xaml') {
    prefix = '<!--';
    suffix = '-->';
  }

  return {
    prefix,
    suffix
  };
}