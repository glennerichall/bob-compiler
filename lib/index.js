#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _yargs = _interopRequireDefault(require("yargs"));

var _version = _interopRequireDefault(require("./version.js"));

var _args = require("./args.js");

// ---------------------------------------------------------------------------
(0, _version["default"])().then(function (value) {
  var _yargs$scriptName$usa, _yargs$scriptName$usa2;

  var argv = (_yargs$scriptName$usa = (_yargs$scriptName$usa2 = _yargs["default"].scriptName('bobc').usage('$0 <cmd> [args]').version(value)).command.apply(_yargs$scriptName$usa2, (0, _toConsumableArray2["default"])(_args.lstCmd))).command.apply(_yargs$scriptName$usa, (0, _toConsumableArray2["default"])(_args.cpmCmd)).showHelpOnFail(true).help().argv;
});