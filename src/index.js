#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings

import yargs from 'yargs';
import version from './version.js';
import { lstCmd, cpmCmd, preCmd } from './cli/cli-args.js';
import { applyPresets } from './cli/cli-presets.js';
import NpmApi from 'npm-api';
import { strict } from 'assert';

// ---------------------------------------------------------------------------
version().then(value => {
  let argv = yargs
    .scriptName('bobc')
    .usage('$0 <cmd> [args]')
    .version(value)
    .command(...lstCmd)
    .command(...preCmd)
    .command(...cpmCmd)
    .wrap(yargs.terminalWidth())
    .demandCommand(1, '')
    .strict()
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
      console.warn(
        `Newer version available ${pkg.version}, consider upgrading it`
      );
    }
  });
});
