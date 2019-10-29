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
  options = options || {
    pattern: '.*',
    parts: 'resolve'
  };
  const pattern = new RegExp(options.pattern);
  let files = await (0, _recursiveReaddir.default)(source);

  if (!!options.verbose) {
    console.log(`${files.length} fichier(s) trouvé(s)`);
    console.log(`Filtrage des fichiers selon [pattern] : `);
  }

  files = files.filter(file => pattern.test(_path.default[options.parts](file)));

  if (options.verbose) {
    console.log(`${files.length} fichier(s) conservé(s)`);
  }

  if (!!options.groupby) {
    let names = options.groupby;
    if (!Array.isArray(names)) names = [names];
    let groups = files.reduce((result, current) => {
      let match = pattern.exec(_path.default[options.parts](current));

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
    return groups;
  }

  return files;
}; // ---------------------------------------------------------------------------


exports.getGroups = getGroups;

const compileGroup = async (source, commentaires, options) => {
  let groups = await getGroups(source, options); // flatten groups

  groups = Object.keys(groups).map(key => groups[key]);

  for (let files of groups) {
    if (options.verbose) {
      console.log(`Compilation du groupe de fichiers : `);

      for (let file of files) {
        console.log(file.replace(_path.default.join(source, '\\'), '\t'));
      }

      console.log('\n');
    }

    let group = new _group.CompilationGroup(files, commentaires);

    if (options.dryrun) {
      group.compilers.forEach(compiler => {
        compiler.document.saveAs = () => true;
      });
    }

    await group.load();
    await group.execute();
  }
}; // ---------------------------------------------------------------------------


exports.compileGroup = compileGroup;

const compileOne = async (source, commentaires, options) => {
  let compiler = new _compiler.Compiler(source, commentaires);

  if (options.dryrun) {
    compiler.document.saveAs = async () => Promise.resolve(true);
  }

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

    if (stats.isDirectory() && !options.single) {
      if (options.verbose) console.log('Compilation par groupes de fichiers');
      await compileGroup(source, commentaires, options);
    } else {
      await compileOne(source, commentaires);
    }
  } catch (e) {
    console.error(e.message);
    return;
  }

  console.log(`Compilation terminée en ${new Date() - start} milliseconde(s)`);
};

exports.compile = compile;