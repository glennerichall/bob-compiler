"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = version;

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = _fs.promises.readFile;

async function version() {
  const pkg = await readFile(_path.default.join(__dirname, '..', 'package.json'), 'utf8');
  console.log(__dirname);
  return 'v' + JSON.parse(pkg).version;
}