const {
    groupby,
    pattern,
    exclude,
    parts,
    single,
    watch,
    results,
    string,
    tagPattern
} = require('./switches');
const logger = require('../../logger.js');
const localPresets = require('../presets.js');
const {compile} = require('../compile.js');

const checkExists = (preset) => {
    if(preset === undefined) return true;
    const presets = localPresets.listPresets();
    if (presets[preset] === undefined) {
        throw new Error(`Le preset ${preset} n'existe pas`);
    }
    return true;
};

const preset = [
    'preset',
    {
        type: 'array',
        default: [],
        describe: "Ensemble(s) d'arguments prédéfinis (Voir commande [preset])",
    }
];

const verbose = [
    'verbose',
    {
        type: 'boolean',
        describe: 'Exécution verbeuse',
    }
];

const dryrun = [
    'dryrun', {
        type: 'boolean',
        describe: 'Ne pas exécuter la commande',
    }

];

const source = [
    'source',
    {
        type: 'string',
        describe:
            'Chemin de fichier ou de répertoire contenant le groupe de fichiers à compiler.',
    }
];

const commentaires = [
    'commentaires',
    {
        type: 'string',
        describe:
            'Chemin de fichier contenant la liste des commentaires et leur pondération.',
    }
];

async function runWatch(timeout, args) {
    setInterval(async () => {
        await compile(source, commentaires, args);
        // TODO https://www.npmjs.com/package/terminal-kit
        // TODO https://www.npmjs.com/package/blessed
        console.clear();
    }, timeout);
}

const cpmCmd = [
    `compile <${source[0]}> <${commentaires[0]}> ${string} [${preset[0]}] [${watch[0]}] [${verbose[0]}] [${dryrun[0]}]`,
    'Compiler les points des commentaires annotés dans les fichiers.',
    (y) =>
        y
            .positional(...source)
            .positional(...commentaires)
            .option(...groupby)
            .option(...pattern)
            .option(...exclude)
            .option(...parts)
            .option(...results)
            .option(...single)
            .option(...watch)
            .option(...tagPattern)
            .options(...preset)
            .option(...dryrun)
            .option(...verbose)
            .check(({preset}) => checkExists(preset))
            .middleware([
                (argv) => {
                    if (argv['_'][0] === 'compile') {
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
            await runWatch(watch, args);
        } else {
            await compile(source, commentaires, args);
        }
    },
];

module.exports = cpmCmd;