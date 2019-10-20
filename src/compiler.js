import { ErrorParser, ResultParser } from './parser.js';
import { CommentList, getDefaultFix } from './comments.js';
import { Document } from './document.js';


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
    let { tag, prefix, suffix, points } = this.range;
    let card = points > 1 ? 's' : '';
    let template = `${prefix} ${tag} ${content}, (${points} point${card}) ${suffix}`;
    return template;
  }
}

export class ResultComment extends Comment {
  constructor(range) {
    super(range);
  }

  getText(sum) {
    let { tag, prefix, suffix, max } = this.range;
    let template = `${prefix} ${tag} ${max-sum}/${max} ${suffix}`;
    return template;
  }
}

export class Compiler {
  constructor(filename, database) {
    this.document = new Document(filename);
    this.database =
      database instanceof CommentList ? database : new CommentList(database);
    this.comments = [];
  }

  async load() {
    await this.document.load();
    await this.database.load();
    let { content } = this.document;
    let parser = new ErrorParser('Err:');
    let range;
    while ((range = parser.parse(content))) {
      this.comments.push(new ErrorComment(range));
    }
    const tag = 'Résultat:';
    let fix = getDefaultFix(this.document.lang);
    let r = new ResultParser(tag).parse(content) || {
      first: 0,
      last: 0,
      ...fix
    };
    r = {
      ...r,
      max: this.database.total.points,
      tag
    };
    this.resultComment = new ResultComment(r);
  }

  async updateErrors(editor) {
    let sum = 0;
    for (let comment of this.comments) {
      let { id } = comment.range;
      let { content, points } = this.database.comments[id];
      comment.range.points = points;
      sum += points;
      comment.update(editor, content);
    }
    return sum;
  }

  async updateResult(editor, sum) {
    this.resultComment.update(editor, sum);
  }

  async execute() {
    await this.document.edit(async editor => {
      let sum = await this.updateErrors(editor);
      await this.updateResult(editor, sum);
      return true;
    });
    await this.document.save();
  }
}
