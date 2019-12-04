import { Compiler } from "../compiler.js";
import { CompilationGroup } from "../group.js";
import { promises } from "fs";
import readdir from "recursive-readdir";
import path from "path";
import logger from '../logger.js';

const { access, lstat, F_OK } = promises;

export const getGroups = async (source, options) => {
  options = options || {
    pattern: ".*",
    parts: "resolve"
  };
  const pattern = new RegExp(options.pattern);
  let files = await readdir(source);

  logger.info(`${files.length} fichier(s) trouvé(s)`);
  logger.info(`Filtrage des fichiers selon [pattern] : `);

  files = files.filter(file => pattern.test(path[options.parts](file)));

  logger.info(`${files.length} fichier(s) conservé(s)`);

  if (!!options.groupby) {
    let names = options.groupby;
    if (!Array.isArray(names)) names = [names];

    let groups = files.reduce((result, current) => {
      let match = pattern.exec(path[options.parts](current));
      if (match) {
        let key = names.reduce((result, key) => {
          result += match.groups[key];
          return result;
        }, "");
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

  logger.info(`${groups.length} groupe(s) de fichier(s)`);

  let results = {};
  for (let group of groups) {
    let files = group.files;
    logger.info(`Compilation du groupe de fichier(s) : ${group.key}`);
    for (let file of files) {
      logger.info(file.replace(path.join(source, "\\"), "\t"));
    }
    logger.info("\n");

    await group.load();
    let result = await group.execute();
    results[group.key] = result;

    if (options.print) {
      await group.export();
    }
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
  let res = await compiler.execute();
  if (options.print) {
    await compiler.document.export();
  }
  return res;
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
      logger.info("Compilation par groupes de fichiers");
      let results = await compileGroup(source, commentaires, options);
      if (options.results == "csv") {
        for (let key in results) {
          console.log(`${key} : ${results[key]}`);
        }
      } else if (options.results == "json") {
        console.log(JSON.stringify(results));
      }
    } else {
      let result = await compileOne(source, commentaires, options);
    }
  } catch (e) {
    logger.error(e.message);
    return;
  }
  logger.info(`\nCompilation terminée en ${new Date() - start} milliseconde(s)`);
};
