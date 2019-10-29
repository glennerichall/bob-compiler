import { Compiler } from './compiler.js';
import { CompilationGroup } from './group.js';
import { promises } from 'fs';
import readdir from 'recursive-readdir';
import path from 'path';

const { access, lstat, F_OK } = promises;

export const getGroups = async (source, options) => {
  options = options || {
    pattern: '.*',
    parts: 'resolve'
  };
  const pattern = new RegExp(options.pattern);
  let files = await readdir(source);

  if (!!options.verbose) {
    console.log(`${files.length} fichier(s) trouvé(s)`);
    console.log(`Filtrage des fichiers selon [pattern] : `);
  }
  files = files.filter(file => pattern.test(path[options.parts](file)));
  if (options.verbose) {
    console.log(`${files.length} fichier(s) conservé(s)`);
  }

  if (!!options.groupby) {
    let names = options.groupby;
    if (!Array.isArray(names)) names = [names];

    let groups = files.reduce((result, current) => {
      let match = pattern.exec(path[options.parts](current));
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
};

// ---------------------------------------------------------------------------
export const compileGroup = async (source, commentaires, options) => {
  let groups = await getGroups(source, options);

  groups = Object.keys(groups).map(key => {
    let files = groups[key];
    let group = new CompilationGroup(files, commentaires);
    group.key = key;
    if (options.dryrun) group.dryrun();
    return group;
  });

  let results = {};
  for (let group of groups) {
    let files = group.files;
    if (options.verbose) {
      console.log(`Compilation du groupe de fichiers : `);
      for (let file of files) {
        console.log(file.replace(path.join(source, '\\'), '\t'));
      }
      console.log('\n');
    }

    await group.load();
    let result = await group.execute();
    results[group.key] = result;
  }
  return results;
};

// ---------------------------------------------------------------------------
export const compileOne = async (source, commentaires, options) => {
  let compiler = new Compiler(source, commentaires);
  if (options.dryrun) {
    compiler.document.saveAs = async () => Promise.resolve(true);
  }
  await compiler.load();
  return await compiler.execute();
};

// ---------------------------------------------------------------------------
export const compile = async (source, commentaires, options) => {
  try {
    await access(source, F_OK);
  } catch (e) {
    console.error(`Le chemin source ${source} n'existe pas`);
    return;
  }
  try {
    await access(commentaires, F_OK);
  } catch (e) {
    console.error(`Le chemin commentaires ${commentaires} n'existe pas`);
    return;
  }
  let start = new Date();
  try {
    const stats = await lstat(source);
    if (stats.isDirectory() && !options.single) {
      if (options.verbose) console.log('Compilation par groupes de fichiers');
      let results = await compileGroup(source, commentaires, options);
      if (options.results == 'csv') {
        for (let key in results) {
          console.log(`${key} : ${results[key]}`);
        }
      } else if (options.results == 'json') {
        console.log(JSON.stringify(results));
      }
    } else {
      let result = await compileOne(source, commentaires);
    }
  } catch (e) {
    console.error(e.message);
    return;
  }
  if (options.verbose) {
    console.log(
      `Compilation terminée en ${new Date() - start} milliseconde(s)`
    );
  }
};
