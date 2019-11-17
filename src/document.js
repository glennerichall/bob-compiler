import { Editor } from "./editor.js";
import { printContent } from "./print.js";
import path from "path";
import Prism from "prismjs";
import { JSDOM } from "jsdom";
import { Script } from "vm";
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

  async export() {
    const ext = path.extname(this.filename);
    const outfile = this.filename.replace(ext, ".pdf");
    let content = Prism.highlight(
      this.content,
      Prism.languages[this.lang],
      this.lang
    );

    let html = `
<html>
<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/themes/prism.min.css">
    <style>
      span.token.comment.grade {
        border: 1px solid;
        margin-top: 10px;
        display: inline-block;
      }
      span.token.comment.error {
        color: red;
        font-size: 1.5em;
        border-color: red;
        border-radius: 3px;
      }
      span.token.comment.result {
        color: black;
        font-size: 2em;
        padding: 10px;
        border-radius: 5px;
      }
    </style>
</head>
<body>
  <pre>${content}</pre>
</body>
</html>
`;

    const dom = new JSDOM(html, {});
    const {
      window: { document }
    } = dom;
    let elems = document.querySelectorAll("span.token.comment");
    elems = Array.from(elems)
      .filter(elem => elem.innerHTML.includes("Err:"))
      .forEach(elem => {
        elem.classList.add("error", "grade");
        elem.innerHTML = elem.innerHTML.replace(/(\/\*|\*\/|&lt;!--|--&gt;)/g, "");
      });

    elems = document.querySelectorAll("span.token.comment");
    elems = Array.from(elems)
      .filter(elem => elem.innerHTML.includes("Résultat:"))
      .forEach(elem => {
        elem.classList.add("result", "grade");
        elem.innerHTML = elem.innerHTML.replace(/(\/\*|\*\/|&lt;!--|--&gt;)/g, "");
      });

    // console.log(dom.serialize());
    return printContent(dom.serialize(), outfile);
  }
}
