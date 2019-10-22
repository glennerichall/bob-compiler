#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings

import yargs from 'yargs';
import version from './version.js';
import { lstCmd, cpmCmd } from './args.js';

// ---------------------------------------------------------------------------
version().then(value => {
  let argv = yargs
    .scriptName('bobc')
    .usage('$0 <cmd> [args]')
    .version(value)
    .command(...lstCmd)
    .command(...cpmCmd)
    .showHelpOnFail(true)
    .help().argv;
});
