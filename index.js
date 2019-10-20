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

version().then(value => {
  yargs
    .scriptName('bobc')
    .usage('$0 <cmd> [args]')
    .version(value)
    .command(
      'compile <source> <commentaires>',
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
          }),
      async args => {
        const { source, commentaires } = args;
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
            console.log(`Compilation du groupe de fichiers : `);
            let files = await readdir(source);
            for (let file of files) {
              console.log(file.replace(path.join(source, '\\'), '\t'));
            }
            let group = new CompilationGroup(files, commentaires);
            await group.load();
            await group.execute();
          } else {
            let compiler = new Compiler(source);
            await compiler.load();
            await compiler.execute();
          }
        } catch (e) {
          console.error(e.message);
          return;
        }
        console.log(
          `Compilation terminée en ${new Date() - start} milliseconde(s)`
        );
      }
    )
    .help().argv;
});
