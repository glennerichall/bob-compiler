#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings
"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

var _version = _interopRequireDefault(require("./version.js"));

var _args = require("./args.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ---------------------------------------------------------------------------
(0, _version.default)().then(value => {
  let argv = _yargs.default.scriptName('bobc').usage('$0 <cmd> [args]').version(value).command(..._args.lstCmd).command(..._args.cpmCmd).option('verbose', {
    type: 'boolean',
    default: 'false',
    describe: 'Exécution verbeuse'
  }).showHelpOnFail(true).help().argv;

  if (argv.verbose) console.log(argv);
});