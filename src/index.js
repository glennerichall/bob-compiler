#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings

const yargs = require('yargs');
const version = require('./version.js');
const { lstCmd, cpmCmd, preCmd, initCmd } = require('./cli/cli-args.js');
const NpmApi = require('npm-api');
const logger = require('./logger.js');
const { levels } = require('./logger.js');

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
            `Newer version available ${pkg.version}, consider upgrading it ($> npm upgrade -g bob-compiler)`
          );
        }
      })
      .catch(() => {});
  })
  .catch(() => {});
