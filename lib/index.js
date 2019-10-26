#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings
"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

var _version = _interopRequireDefault(require("./version.js"));

var _args = require("./args.js");

var _cliPresets = require("./cli-presets.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ---------------------------------------------------------------------------
(0, _version.default)().then(value => {
  let argv = _yargs.default.scriptName('bobc').usage('$0 <cmd> [args]').version(value).command(..._args.lstCmd).command(..._args.preCmd).command(..._args.cpmCmd).option('verbose', {
    type: 'boolean',
    describe: 'Exécution verbeuse'
  }).option('dryrun', {
    type: 'boolean',
    describe: 'Ne pas exécuter la commande'
  }).middleware([argv => {
    if (argv['_'][0] == 'compile') {
      if (argv.verbose) console.log('Applying presets');
      let presets = (0, _cliPresets.applyPresets)(argv.preset || []);

      for (let key of Object.keys(presets)) {
        argv[key] = presets[key];
      }
    }
  }]).showHelpOnFail(true).help().argv;

  if (argv.verbose) {
    console.log('\nCurrent effective options are:');
    console.log(argv);
  }
});