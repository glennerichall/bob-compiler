const {} = require('./switches');
const logger = require('../../logger.js');
const localPresets = require('../presets.js');
const {writeFile, copyFile, access} = require('fs').promises;
const {constants} = require('fs');
const path = require('path');

async function exists(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

const preset = [
    'preset', {
        type: 'string',
        describe: 'Le preset à utiliser pour ce fichier de facilitation',
    }
];

const devoir = [
    'd', {
        alias: 'devoir',
        type: 'string',
        describe: 'Le nom du devoir pour le preset Devoirs',
    }
];

const initCmd = [
    `init [${preset[0]}] [devoir]`,
    'Créer des fichiers de scripts pour faciliter la correction.',
    (y) => {
        y.option(...preset)
            .option(...devoir);
    },
    async (args) => {
        let {preset} = args;
        let pt = '';
        if (!!preset) {
            let p = localPresets.getPreset(preset);
            if (!p) {
                logger.warn(`Le preset ${preset} n'existe pas`);
            }
            pt = '--preset ' + preset;
        } else {
            // FIXME let yargs do the job of determining if devoir is optional
            if (!args.devoir) {
                console.log("Le nom du devoir doit être fourni (-d=devoir)");
                return;
            }
            preset = args.devoir;
            let data = require('../assets/presets').devoirs(args.devoir);
            localPresets.putPreset(preset, data);
            pt = '--preset ' + preset;
        }

        let files = [];
        switch (process.platform) {
            case 'win32':
                files = require('../assets/win32.js').files;
                break;
            case 'darwin':
                logger.error("MacOS n'est pas supporté pour cette fonctionnalité pour l'instant");
                return;
            case 'linux':
                files = require('../assets/linux.js').files;
                break;
            default:
                logger.error(
                    `${process.platform} n'est pas supporté pour cette fonctionnalité`
                );
                return;
        }
        try {
            const promises = files.map(async (file) => {
                let {name, content, postProcess} = file;
                name = name.replace('@{preset}', preset);
                content = content
                    .replace(/@{preset}/g, preset)
                    .replace(/@{curdir}/g, process.cwd());
                await writeFile(name, content);
                if (postProcess) return postProcess(name);
            });
            promises.push((async () => {
                const filename = path.join(process.cwd(), `${name}-comentaires.txt`);
                if (!(await exists(filename))) {
                    return copyFile(path.join(__dirname, '..', 'assets', 'commentaires.txt'), filename);
                }
                return Promise.resolve();
            })());
            await Promise.all(promises);
        } catch (e) {
            logger.trace(e);
        }
    },
];


module.exports = initCmd;