import { promises } from 'fs';

const readFile = promises.readFile;

export default async function version(){
    const pkg = await readFile('./package.json', 'utf8');
    return 'v' + JSON.parse(pkg).version;
}