"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = void 0;

var _editor = require("./editor.js");

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  writeFile,
  readFile
} = _fs.promises;

class Document {
  constructor(filename) {
    this.filename = filename;
    this.content = null;
    this.lang = _path.default.extname(filename).replace('.', '');
  }

  async load() {
    this.content = await readFile(this.filename, 'utf8');
  }

  async edit(edition) {
    let editor = new _editor.Editor(this);

    if (await edition(editor)) {
      await editor.done();
      this.modified = true;
    }
  }

  async saveAs(filename) {
    if (!this.modified) return Promise.resolve(false);
    await writeFile(filename, this.content, 'utf8');
    return Promise.resolve(true);
  }

  async save() {
    return this.saveAs(this.filename);
  }

}

exports.Document = Document;