import { Editor } from "./editor.js";
import { printContent } from "./print.js";
import path from "path";
import Prism from "prismjs";
import { JSDOM } from "jsdom";
import { promises } from "fs";
const { writeFile, readFile } = promises;

export class Document {
  constructor(filename) {
    this.filename = filename;
    this.content = null;
    this.lang = path.extname(filename).replace(".", "");
  }

  async load() {
    this.content = await readFile(this.filename, "utf8");
  }

  async edit(edition) {
    let editor = new Editor(this);
    if (await edition(editor)) {
      await editor.done();
      this.modified = true;
    }
  }

  async saveAs(filename) {
    if (!this.modified) return Promise.resolve(false);
    await writeFile(filename, this.content, "utf8");
    return Promise.resolve(true);
  }

  async save() {
    return this.saveAs(this.filename);
  }

}
