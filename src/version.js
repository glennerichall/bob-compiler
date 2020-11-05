const { promises } = require('fs');
const path = require('path');

const readFile = promises.readFile;

module.exports = async function version() {
  const pkg = await readFile(
    path.join(__dirname, '..', 'package.json'),
    'utf8'
  );
  return 'v' + JSON.parse(pkg).version;
}
