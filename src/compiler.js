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

export class EditorAction {
  constructor(range) {
    this.range = range;
  }

  compare(other) {
    return this.range.first - other.range.first;
  }

  advance(editor) {
    editor.cursor = this.range.last + 1;
  }
}

export class ReplaceRangeAction extends EditorAction {
  constructor(range, content) {
    super(range);
    this.content = content;
  }

  execute(editor) {
    this.advance(editor);
    return this.content;
  }
}

export class DeleteRangeAction extends EditorAction {
  constructor(range) {
    super(range);
  }

  execute(editor) {
    this.advance(editor);
    return '';
  }
}

export class InsertRangeAction extends EditorAction {
  constructor(range, content) {
    super(range);
    this.content = content;
  }

  execute(editor) {
    return this.content;
  }
}

export class NoopAction extends EditorAction {
  constructor(range) {
    super(range);
  }

  execute(editor) {
    this.advance(editor);
    return editor.document.text.substring(
      this.range.first,
      this.range.last + 1
    );
  }
}

export class Editor {
  constructor(document) {
    this.document = document;
    this.commands = [];
    this.cursor = 0;
  }

  replaceRange(range, content) {
    this.commands.push(new ReplaceRangeAction(range, content));
  }

  prepare() {
    let { commands } = this;
    commands.sort((a, b) => a.compare(b));
    let result = [];
    let cursor = 0;
    let i = 0;
    let n = this.document.text.length;
    do {
      let command = commands[i];
      let first = command.range.first;
      if (i!=0) {
        let previous = commands[i - 1].range.last + 1;
        if (previous < first) {
          let noop = new NoopAction({
            first: previous,
            last: first - 1
          });
          result.push(noop);
        }
      } else if (first != 0) {
        let noop = new NoopAction({
          first: 0,
          last: first - 1
        });
        result.push(noop);
      }
      result.push(command);
     
      cursor = command.range.last;
      i++;
    } while (i < commands.length);
    if (cursor < n) {
      let noop = new NoopAction({
        first: cursor + 1,
        last: n - 1
      });
      result.push(noop);
    }
    return result;
  }

  done() {
    let commands = this.prepare();
    let text = '';
    for (let i = 0; i < commands.length; i++) {
      text += commands[i].execute(this);
    }
    this.document.text = text;
  }
}

export class Document {
  constructor(filename, database) {
    this.filename = filename;
    this.database = database;
    this.sum = 0;
    this.content = null;
    this.comments = [];
    this.modified = null;
    this.lang = path.extname(filename);
    this.resultComment = null;
    this.sumComment = null;
  }

  async init() {
    this.content = await readFile(this.filename, 'utf8');
    let content = this.content;
    // for (let comment of eachComments(this.content)) {
    //   comment = getInfo(comment, this.database);
    //   this.sum += comment.points;
    //   this.comments.push(new Comment(comment, this));
    // }
    // let range = getCommentRange('Total dans ce fichier:');
    // this.sumComment = new Comment(range, this);
    // range = getCommentRange('Résultat:');
    // this.resultComment = new Comment(range, this);
    let parser = new ErrorParser();
    let range;
    while ((range = parser.parse(content))) {
      this.comments.push(new Comment(range));
    }
    this.resultComment = new Comment(new ResultParser().parse(content));
  }

  async update() {
    if (!this.content) await this.init();
    this.modified = this.content;
    for (let comment of this.comments) {
      this.modified = this.modified.replace(comment.content, comment.message);
    }
  }

  edit(edition) {
    let editor = new Editor(this);
    if (edition(editor)) {
      editor.done();
    }
  }

  async save() {
    if (!this.modified) return Promise.resolve(false);
    await writeFile(this.filename, this.modified, 'utf8');
    this.content = this.modified;
    this.modified = null;
    return Promise.resolve(true);
  }
}
