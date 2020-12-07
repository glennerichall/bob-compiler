const {Editor} = require('./editor.js');
const path = require('path');
const {promises} = require('fs');
const {threadId} = require('worker_threads');
const {writeFile, readFile} = promises;

module.exports.Document = class Document {
    constructor(filename) {
        this.filename = filename;
        this.content = null;
        this.lang = path.extname(filename).replace('.', '');
    }

    async load() {
        try {
            this.content = await readFile(this.filename, 'utf8');
            // https://stackoverflow.com/questions/24356713/node-js-readfile-error-with-utf8-encoded-file-on-windows
            // issue #8
        } catch (e) {
            throw e;
        }
        this.content = this.content.replace(/^\uFEFF/, '');
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
        try {
            await writeFile(filename, this.content, 'utf8');
            return Promise.resolve(true);
        } catch (e) {
            throw e;
        }
    }

    async save() {
        return this.saveAs(this.filename);
    }
}
