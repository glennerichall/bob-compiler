export class Parser {
  constructor(pattern) {
    this.pattern = pattern;
  }

  parse(text) {
    let matches = this.pattern.exec(text);
    if (matches) {
      let prefix = matches[1];
      let suffix = matches[matches.length - 1];
      return {
        first: matches.index,
        last: matches.index + matches[0].length,
        prefix,
        suffix,
        content: matches[0].replace(prefix, '').replace(suffix, ''),
        text: matches[0],
        matches
      };
    }
    return null;
  }
}

const prefixPattern = '(<!--|\\/\\*)\\s*';
const suffixPattern = '\\s*(-->|\\*\\/)';
const tagPlaceholder = '{tag}';
const anythingThatFollowsPattern = '.*';
const tagPattern = `${prefixPattern}(${tagPlaceholder})${anythingThatFollowsPattern}${suffixPattern}`;

export class TagParser extends Parser {
  constructor(pattern) {
    super(new RegExp(tagPattern.replace(tagPlaceholder, pattern), 'g'));
  }

  parse(text) {
    let range = super.parse(text);
    if (!range) return range;
    range.tag = range.matches[2];
    range.content = range.content.replace(range.tag, '').trim();
    return range;
  }
}

const errorTagPattern = 'Err: \\((\\d+)\\)';
export class ErrorParser extends TagParser {
  constructor() {
    super(errorTagPattern);
  }

  parse(text) {
    let range = super.parse(text);
    if (!range) return range;
    range.id = Number.parseInt(range.matches[3]);
    return range;
  }
}

const numPattern = '(\\d+(\\.\\d+){0,1})';
const resultPattern = `${tagPlaceholder}\\s*${numPattern}/${numPattern}`;
export class ResultParser extends TagParser {
  constructor(tag) {
    super(resultPattern.replace(tagPlaceholder, tag));
  }

  parse(text) {
    let range = super.parse(text);
    if (!range) return range;
    range.result = Number.parseFloat(range.matches[3]);
    range.points = Number.parseFloat(range.matches[5]);
    return range;
  }
}
