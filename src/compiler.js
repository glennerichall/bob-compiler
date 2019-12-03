import { asDatabase, getDefaultFix } from './comments.js';
import { Document } from './document.js';
import { createErrorParser, createResultParser } from './parser.builder.js';

export class Comment {
  constructor(range) {
    this.range = range;
  }

  update(editor, content) {
    if (this.range.first == this.range.last) {
      editor.insertPosition(this.range.first, this.getText(content) + '\n');
    } else {
      editor.replaceRange(this.range, this.getText(content));
    }
  }

  getText() {}
}

export class ErrorComment extends Comment {
  constructor(range) {
    super(range);
  }

  getText(content) {
    let { tag, begin, end, points } = this.range;
    let card = points > 1 ? 's' : '';
    let template = `${begin} ${tag} ${content}, (${points} point${card}) ${end||''}`;
    return template;
  }
}

export class ResultComment extends Comment {
  constructor(range) {
    super(range);
  }

  getText(sum) {
    let { tag, begin, end, max } = this.range;
    let template = `${begin} ${tag} ${Math.max(max - sum, 0)}/${max} ${end}`;
    return template;
  }
}

export class Compiler {
  constructor(filename, database) {
    this.document = new Document(filename);
    this.database = asDatabase(database);
    this.comments = [];
  }

  async load() {
    await this.document.load();
    await this.database.load();
    let { content } = this.document;
    let parser = createErrorParser('Err:{0,1}', ':{0,1}');
    let range;
    while ((range = parser.parse(content))) {
      this.comments.push(new ErrorComment(range));
    }
    const tag = 'Résultat:';
    let fix = getDefaultFix(this.document.lang);
    let r = createResultParser(tag).parse(content) || {
      first: 0,
      last: 0,
      ...fix
    };
    r = {
      ...r,
      max: this.database.total,
      tag
    };
    this.resultComment = new ResultComment(r);
  }

  async updateErrors(editor) {
    let sum = 0;
    for (let comment of this.comments) {
      let { id } = comment.range;
      if (!this.database.comments[id]) {
        const line = this.document.content
          .substring(0, comment.range.first)
          .split('\n').length;
        console.error(
          `Tag ${id} not found in ${this.database.filename} at line ${line} of ${this.document.filename}`
        );
        continue;
      }
      let { target, points } = this.database.comments[id];
      comment.range.points = points;
      sum += points;
      comment.update(editor, target);
    }
    return sum;
  }

  async updateResult(editor, sum) {
    this.resultComment.update(editor, sum);
  }

  async execute() {
    let sum = 0;
    await this.document.edit(async editor => {
      sum = await this.updateErrors(editor);
      await this.updateResult(editor, sum);
      return true;
    });
    await this.document.save();
    return Math.max(this.database.total.points - sum, 0);
  }
}
