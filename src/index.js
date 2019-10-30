#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings

import yargs from 'yargs';
import version from './version.js';
import { lstCmd, cpmCmd, preCmd } from './args.js';
import { applyPresets } from './cli-presets.js';
import NpmApi from 'npm-api';

// ---------------------------------------------------------------------------
version().then(value => {
  let argv = yargs
    .scriptName('bobc')
    .usage('$0 <cmd> [args]')
    .version(value)
    .command(...lstCmd)
    .command(...preCmd)
    .command(...cpmCmd)
    .option('verbose', {
      type: 'boolean',
      describe: 'Exécution verbeuse'
    })
    .option('dryrun', {
      type: 'boolean',
      describe: 'Ne pas exécuter la commande'
    })
    .middleware([
      argv => {
        if (argv['_'][0] == 'compile') {
          if (argv.verbose) console.log('Applying presets');
          let presets = applyPresets(argv.preset || []);
          for (let key of Object.keys(presets)) {
            argv[key] = presets[key];
          }
        }
      }
    ])
    .showHelpOnFail(true)
    .help().argv;

  if (argv.verbose) {
    console.log('\nCurrent effective options are:');
    console.log(argv);
  }

  let npm = new NpmApi();
  var repo = npm.repo('bob-compiler');

  repo.package().then(pkg => {
    if ('v' + pkg.version != value) {
      console.warn(`Newer version available ${pkg.version}, consider upgrading it`);
    }
  });
});
