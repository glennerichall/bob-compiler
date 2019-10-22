"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResultParser = exports.ErrorParser = exports.TagParser = exports.Parser = void 0;

class Parser {
  constructor(pattern, options) {
    this.pattern = pattern;
    this.options = options || {};
    this.options.transformers = this.options.transformers || {};
  }

  parse(text) {
    let {
      options: {
        transformers
      }
    } = this;
    let matches = this.pattern.exec(text);

    if (matches) {
      let range = {
        matches: Array.from(matches),
        ...matches.groups,
        first: matches.index,
        last: matches.index + matches[0].length - 1
      };

      for (let key in range) {
        if (transformers[key]) {
          range[key] = transformers[key](range[key]);
        }
      }

      return range;
    }

    return null;
  }

}

exports.Parser = Parser;
const prefixPattern = '(?<prefix><!--|\\/\\*)\\s*';
const suffixPattern = '\\s*(?<suffix>-->|\\*\\/)';
const tagPlaceholder = '{tag}';
const anythingThatFollowsPattern = '.*';
const tagPattern = `${prefixPattern}(?<tag>${tagPlaceholder})(?<content>${anythingThatFollowsPattern})${suffixPattern}`;

class TagParser extends Parser {
  constructor(pattern, options) {
    let transformers = {
      content: content => content.trim()
    };
    options = options || {
      transformers: {}
    };
    options.transformers = { ...transformers,
      ...options.transformers
    };
    super(new RegExp(tagPattern.replace(tagPlaceholder, pattern), 'g'), options);
  }

}

exports.TagParser = TagParser;
const errorTagPattern = `${tagPlaceholder}\\s*\\((?<id>\\d+)\\)`;

class ErrorParser extends TagParser {
  constructor(tag) {
    let transformers = {
      id: id => Number.parseInt(id)
    };
    super(tag instanceof RegExp ? tag : errorTagPattern.replace(tagPlaceholder, tag), {
      transformers
    });
  }

}

exports.ErrorParser = ErrorParser;
const numPattern = '(?<{name}>\\d+(\\.\\d+){0,1})';
const resultPattern = `${tagPlaceholder}\\s*${numPattern.replace('{name}', 'result')}/${numPattern.replace('{name}', 'points')}`;

class ResultParser extends TagParser {
  constructor(tag) {
    let transformers = {
      points: value => Number.parseFloat(value),
      result: value => Number.parseFloat(value),
      tag: value => tag
    };
    super(resultPattern.replace(tagPlaceholder, tag), {
      transformers
    });
  }

}

exports.ResultParser = ResultParser;