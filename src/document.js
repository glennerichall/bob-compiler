import { Editor } from './editor.js';

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
