const {

} = require('../switches');
const logger = require('../../logger.js');
const localPresets = require('../cli-presets.js');

const initCmd = [
    'init [preset]',
    'Créer des fichiers de scripts pour faciliter la correction.',
    (y) => {
        y.option('preset', {
            type: 'string',
            describe: 'Le preset à utiliser pour ce fichier de facilitation',
        });
    },
    async (args) => {
        let { preset } = args;
        let pt = '';
        if (!!preset) {
            let p = localPresets.getPreset(preset);
            if (!p) {
                logger.warn(`Le preset ${preset} n'existe pas`);
            }
            pt = '--preset ' + preset;
        }

        let files = [];
        switch (process.platform) {
            case 'win32':
                files = require('../../assets/win32.js').files;
                break;
            case 'darwin':
                logger.error("MacOS n'est pas supporté pour cette fonctionnalité pour l'instant");
                return;
            case 'linux':
                files = require('../../assets/linux.js').files;
                break;
            default:
                logger.error(
                    `${process.platform} n'est pas supporté pour cette fonctionnalité`
                );
                return;
        }
        try {
            const promises = files.map(async (file) => {
                let {name, content} = file;
                content = content
                    .replace('@{preset}', pt)
                    .replace('@{curdir}', process.cwd());
                return writeFile(name, content);
            });
            await Promise.all(promises);
        } catch (e) {
            logger.trace(e);
        }
    },
];


module.exports = initCmd;