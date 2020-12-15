const {
    groupby,
    pattern,
    exclude,
    parts,
    single,
    watch
} = require('../switches');
const logger = require('../../logger.js');
const localPresets = require('../cli-presets.js');
const { compile } = require('../cli-compile.js');

const cpmCmd = [
    'compile <source> <commentaires> [groupby] [pattern] [exclude] [parts] [single] [preset] [results] [verbose] [dryrun] [watch]',
    'Compiler les points des commentaires annotés dans les fichiers.',
    (y) =>
        y
            .positional('source', {
                type: 'string',
                describe:
                    'Chemin de fichier ou de répertoire contenant le groupe de fichiers à compiler.',
            })
            .positional('commentaires', {
                type: 'string',
                describe:
                    'Chemin de fichier contenant la liste des commentaires et leur pondération.',
            })
            .option(...groupby)
            .option(...pattern)
            .option(...exclude)
            .option(...parts)
            .option(...single)
            .option(...results)
            .option(...watch)
            .option('preset', {
                type: 'array',
                default: [],
                describe: "Ensemble(s) d'arguments prédéfinis (Voir commande [preset])",
            })
            .option('verbose', {
                type: 'boolean',
                describe: 'Exécution verbeuse',
            })
            .option('dryrun', {
                type: 'boolean',
                describe: 'Ne pas exécuter la commande',
            })
            .middleware([
                (argv) => {
                    if (argv['_'][0] == 'compile') {
                        logger.info('Applying presets');
                        let presets = localPresets.applyPresets(argv.preset || []);
                        for (let key of Object.keys(presets)) {
                            argv[key] = presets[key];
                        }
                    }
                },
            ])
            .implies('groupby', 'pattern')
            .implies('parts', 'pattern'),
    async (args) => {
        const {source, commentaires, watch} = args;
        if (watch) {
            function sleep(ms) {
                return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                });
            }

            while (true) {
                await compile(source, commentaires, args);
                await sleep(5000);
                console.clear();
            }
        } else {
            await compile(source, commentaires, args);
        }
    },
];

module.exports = cpmCmd;