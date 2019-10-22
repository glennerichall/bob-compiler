"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = exports.compileOne = exports.compileGroup = exports.getGroups = void 0;

var _compiler = require("./compiler.js");

var _group = require("./group.js");

var _fs = require("fs");

var _recursiveReaddir = _interopRequireDefault(require("recursive-readdir"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  access,
  lstat,
  F_OK
} = _fs.promises;

const getGroups = async (source, options) => {
  options = options || {};
  const pattern = new RegExp(options.pattern);
  let files = await (0, _recursiveReaddir.default)(source);
  files = files.filter(file => pattern.test(_path.default.basename(file)));

  if (options.groupby) {
    let names = options.groupby;
    if (!Array.isArray(names)) names = [names];
    let groups = files.reduce((result, current) => {
      let match = pattern.exec(_path.default.basename(current));

      if (match) {
        let key = names.reduce((result, key) => {
          result += match.groups[key];
          return result;
        }, '');

        if (!result[key]) {
          result[key] = [];
        }

        result[key].push(current);
      }

      return result;
    }, {});
    return Object.keys(groups).map(key => groups[key]);
  }

  return [files];
}; // ---------------------------------------------------------------------------


exports.getGroups = getGroups;

const compileGroup = async (source, commentaires, options) => {
  let groups = await getGroups(source, options);

  for (let files of groups) {
    console.log(`Compilation du groupe de fichiers : `);

    for (let file of files) {
      console.log(file.replace(_path.default.join(source, '\\'), '\t'));
    }

    let group = new _group.CompilationGroup(files, commentaires);
    await group.load();
    await group.execute();
  }
}; // ---------------------------------------------------------------------------


exports.compileGroup = compileGroup;

const compileOne = async (source, commentaires) => {
  let compiler = new _compiler.Compiler(source);
  await compiler.load();
  await compiler.execute();
}; // ---------------------------------------------------------------------------


exports.compileOne = compileOne;

const compile = async (source, commentaires, options) => {
  try {
    await access(source, F_OK);
  } catch (e) {
    console.error(`Le chemin source ${source} n'existe pas`);
  }

  try {
    await access(commentaires, F_OK);
  } catch (e) {
    console.error(`Le chemin commentaires ${commentaires} n'existe pas`);
  }

  let start = new Date();

  try {
    const stats = await lstat(source);

    if (stats.isDirectory()) {
      compileGroup(source, commentaires, options);
    } else {
      compileOne(source, commentaires);
    }
  } catch (e) {
    console.error(e.message);
    return;
  }

  console.log(`Compilation terminée en ${new Date() - start} milliseconde(s)`);
};

exports.compile = compile;