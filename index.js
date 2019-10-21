#!/usr/bin/env node --experimental-modules --no-warnings

import { Compiler } from './src/compiler.js';
import { Parser } from './src/parser.js';
import { Document } from './src/document.js';
import { CompilationGroup } from './src/group.js';
import yargs from 'yargs';
import { promises } from 'fs';
import readdir from 'recursive-readdir';
import version from './src/version.js';
import path from 'path';

const { access, lstat, F_OK } = promises;

const getGroups = async (source, options) => {
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
const compileGroup = async (source, commentaires, options) => {
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
const compileOne = async (source, commentaires) => {
  let compiler = new Compiler(source);
  await compiler.load();
  await compiler.execute();
};

// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
const lstCmd = [
  'list <commentaires>',
  'Afficher la liste des commentaires contenu dans le fichier',
  y =>
    y.positional('commentaires', {
      type: 'string',
      describe:
        'Chemin de fichier contenant la liste des commentaires et leur pondération.'
    }),
  args => {
    const { commentaires } = args;
  }
];

// ---------------------------------------------------------------------------
const cpmCmd = [
  'compile <source> <commentaires> [groupby] [pattern]',
  'Compiler les points des commentaires annotés dans les fichiers.',
  y =>
    y
      .positional('source', {
        type: 'string',
        describe:
          'Chemin de fichier ou de répertoire contenant le groupe de fichiers à compiler.'
      })
      .positional('commentaires', {
        type: 'string',
        describe:
          'Chemin de fichier contenant la liste des commentaires et leur pondération.'
      })
      .option('groupby', {
        type: 'string',
        describe: "Grouper les fichiers selon les greoupes nommés dans l'expression régulière déterminé par l'option [pattern]"
      })
      .option('pattern', {
        type: 'string',
        default: '.*',
        describe: "Filtrer les fichier selon une expression régulière"
      })
      .implies('groupby', 'pattern'),
  async args => {
    const { source, commentaires } = args;
    compile(source, commentaires, args);
  }
];

// ---------------------------------------------------------------------------
version().then(value => {
  yargs
    .scriptName('bobc')
    .usage('$0 <cmd> [args]')
    .version(value)
    .command(...lstCmd)
    .command(...cpmCmd)
    .help().argv;
});
