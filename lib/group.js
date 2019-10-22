"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompilationGroup = void 0;

var _compiler = require("./compiler.js");

class SubCompiler extends _compiler.Compiler {
  constructor(file, database, group) {
    super(file, database);
    this.group = group;
  }

  async updateResult(editor, sum) {
    sum = await this.group.sync(sum);
    await super.updateResult(editor, sum);
  }

}

class CompilationGroup {
  constructor(files, database) {
    this.compilers = files.map(file => new SubCompiler(file, database, this));
  }

  async sync(sum) {
    this.count++;
    this.sum += sum;

    if (this.count >= this.compilers.length) {
      this.resolve(this.sum);
    }

    return this.syncPromise;
  }

  async load() {
    let promises = this.compilers.map(compiler => compiler.load());
    await Promise.all(promises);
  }

  async execute() {
    this.count = 0;
    this.sum = 0;
    this.syncPromise = new Promise((resolve, reject) => {
      this.resolve = resolve;
    });
    let promises = this.compilers.map(compiler => compiler.execute());
    await Promise.all(promises);
  }

}

exports.CompilationGroup = CompilationGroup;