import { promises } from 'fs';
import path from 'path';

const readFile = promises.readFile;

export default async function version() {
  const pkg = await readFile(
    path.join(__dirname, '..', 'package.json'),
    'utf8'
  );
  console.log(__dirname);
  return 'v' + JSON.parse(pkg).version;
}
