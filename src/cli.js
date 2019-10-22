import { Compiler } from './compiler.js';
import { CompilationGroup } from './group.js';
import { promises } from 'fs';
import readdir from 'recursive-readdir';
import path from 'path';

const { access, lstat, F_OK } = promises;

export const getGroups = async (source, options) => {
  options = options || {};

  const pattern = new RegExp(options.pattern);
  let files = await readdir(source);
  files = files.filter(file=>pattern.test(path.basename(file)));

  if (options.groupby) {
    let names = options.groupby;
    if (!Array.isArray(names)) names = [names];

    let groups = files.reduce((result, current) => {
      let match = pattern.exec(path.basename(current));
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
};

// ---------------------------------------------------------------------------
export const compileGroup = async (source, commentaires, options) => {
  let groups = await getGroups(source, options);
  for (let files of groups) {
    console.log(`Compilation du groupe de fichiers : `);

    for (let file of files) {
      console.log(file.replace(path.join(source, '\\'), '\t'));
    }
    let group = new CompilationGroup(files, commentaires);
    await group.load();
    await group.execute();
  }
};

// ---------------------------------------------------------------------------
export const compileOne = async (source, commentaires) => {
  let compiler = new Compiler(source);
  await compiler.load();
  await compiler.execute();
};

// ---------------------------------------------------------------------------
export const compile = async (source, commentaires, options) => {
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