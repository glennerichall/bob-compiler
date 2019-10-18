import { ErrorParser, ResultParser } from './parser.js';

import path from 'path';
import fs from 'fs';
import util from 'util';
// import readdir from 'recursive-readdir';

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// import {
//   getComments,
//   eachComments,
//   getInfo,
//   getDefaultFix,
//   getCommentRange
// } from './comments.js';

const placeholder = '{palceholder}';
export class Comment {
  constructor(range, document) {
    this.range = range;
    this.document = document;
    this.template = `${this.prefix} ${placeholder} ${this.suffix}`;
  }

  update(content, editor) {
    if (arguments.length == 1) {
      this.document.edit(editor => this.update(content, editor));
      return;
    }
    editor.replace(this.range, content);
  }
}
