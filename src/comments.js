import fs from 'fs';
import util from 'util';
import { Parser, ErrorParser, ResultParser } from './parser.js';

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);

class CommentDbParser extends ErrorParser {
  constructor(tag) {
    super(tag);
    let pattern = '\\s*(?<points>\\d+(\\.\\d+){0,1})\\s*' + this.pattern.source;
    this.pattern = new RegExp(pattern, 'g');
    this.options.transformers.points = value => Number.parseFloat(value);
  }
}

export function asDatabase(database) {
  return database instanceof CommentList ? database : new CommentList(database);
}

export class CommentList {
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
    this.total = new Parser(/Total:\s*(?<points>\d+)/g, {
      transformers: { points: value => Number.parseInt(value) }
    }).parse(content);
  }
}

export function getDefaultFix(lang) {
  let prefix, suffix;
  if (
    lang == 'js' ||
    lang == 'css' ||
    lang == 'cs' ||
    lang == 'cpp' ||
    lang == 'c' ||
    lang == 'c++' ||
    lang == 'java'
  ) {
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
