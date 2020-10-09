#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings

import yargs from 'yargs';
import version from './version.js';
import { lstCmd, cpmCmd, preCmd, initCmd } from './cli/cli-args.js';
import NpmApi from 'npm-api';
import logger from './logger.js';
import { levels } from './logger.js';

// ---------------------------------------------------------------------------
version()
  .then((value) => {
    try {
      let argv = yargs
        .scriptName('bobc')
        .usage('$0 <cmd> [args]')
        .version(value)
        .command(...lstCmd)
        .command(...preCmd)
        .command(...cpmCmd)
        .command(...initCmd)
        .wrap(yargs.terminalWidth())
        .demandCommand(1, '')
        .strict()
        .showHelpOnFail(true)
        .exitProcess(false)
        .help().argv;

      if (argv.verbose) {
        logger.level = levels.info;
      }

      logger.info('\nCurrent effective options are:');
      logger.info(argv);
    } catch (e) {}

    let npm = new NpmApi();
    var repo = npm.repo('bob-compiler');
    repo
      .package()
      .then((pkg) => {
        if ('v' + pkg.version != value) {
          console.warn(
            `Newer version available ${pkg.version}, consider upgrading it`
          );
        }
      })
      .catch(() => {});
  })
  .catch(() => {});
