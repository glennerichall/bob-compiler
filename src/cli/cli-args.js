const {compile} = require('./cli-compile.js');
const localPresets = require('./cli-presets.js');
const {promises} = require('fs');
const {stat, writeFile} = promises;
const logger = require('../logger.js');

const groupby = [
    'groupby',
    {
        type: 'string',
        describe: 'Grouper les fichiers selon les groupes nommés',
    },
];

const pattern = [
    'pattern',
    {
        type: 'string',
        default: '.*',
        describe: 'Filtrer les fichiers selon une expression régulière',
    },
];

const exclude = [
    'exclude',
    {
        type: 'string',
        default: 'null',
        describe: 'Exclure certains fichiers selon une expression régulière'
    }
];

const parts = [
    'parts',
    {
        choices: ['basename', 'dirname', 'extname', 'resolve'],
        default: 'basename',
        describe: 'Considérer seulement certaines parties du nom de fichier',
    },
];

const single = [
    'single',
    {
        type: 'boolean',
        describe:
            'Compiler les fichiers individuellement même si source est un répertoire',
    },
];

const results = [
    'results',
    {
        choices: ['none', 'csv', 'json'],
        describe: 'Affiche les résultats finaux',
    },
];

const watch = [
    'watch',
    {
        type: 'boolean',
        describe: 'Observe et recompile les fichiers lors de la correction',
    },
];

// ---------------------------------------------------------------------------
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
        let {preset} = args;
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

// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
const lstCmd = [
    'list <commentaires>',
    'Afficher la liste des commentaires contenu dans le fichier',
    (y) =>
        y.positional('commentaires', {
            type: 'string',
            describe:
                'Chemin de fichier contenant la liste des commentaires et leur pondération.',
        }),
    (args) => {
        const {commentaires} = args;
    },
];

// ---------------------------------------------------------------------------
const add_args = '<preset> [groupby] [pattern] [exclude] [parts] [single] [results]';
const add_build = (y) =>
    y
        .positional('preset', {
            type: 'string',
            describe: 'Nom du preset',
        })
        .option(groupby[0], {...groupby[1], default: undefined})
        .option(pattern[0], {...pattern[1], default: undefined})
        .option(exclude[0], {...exclude[1], default: undefined})
        .option(parts[0], {...parts[1], default: undefined})
        .option(results[0], {...results[1], default: undefined})
        .option(single[0], {...single[1], default: undefined})
        .group(
            ['groupby', 'pattern', 'parts', 'results', 'single'],
            'Preset parameters'
        )
        .check(
            (args) =>
                args.groupby != undefined ||
                args.pattern != undefined ||
                args.exclude != undefined ||
                args.parts != undefined ||
                args.results != undefined ||
                args.single != undefined
        );

const check_exists = (preset) => {
    const presets = localPresets.listPresets();
    if (presets[preset] == undefined) {
        throw new Error(`Le preset ${preset} n'existe pas`);
    }
    return true;
};

const preCmd = [
    'presets',
    "Gérer les groupes d'arguments prédéfinis (preset)",
    (yargs) =>
        yargs
            .usage('$0 presets <cmd> [args]')
            .command(
                `add ${add_args}`,
                'Ajouter un preset',
                (y) => add_build(y),
                (args) => {
                    localPresets.putPreset(args.preset, args);
                    console.log('done');
                }
            )
            .command(
                `append ${add_args}`,
                'Ajouter des arguments à un preset',
                (y) => add_build(y).check((args) => check_exists(args.preset)),
                (args) => {
                    localPresets.mergePreset(args.preset, args);
                    console.log('done');
                }
            )
            .command(
                'rename <old> <new>',
                'Renommer un preset',
                (y) =>
                    y
                        .positional('old', {
                            type: 'string',
                            describe: 'Le preset a renommer',
                        })
                        .positional('new', {
                            type: {
                                type: 'string',
                                describe: 'Le nouveau nom',
                            },
                        }),
                (args) => {
                    const presets = localPresets.listPresets();
                    if (presets[args.old] == undefined) {
                        logger.error(`Le preset ${args.old} n'existe pas`);
                    } else if (presets[args.new] != undefined) {
                        logger.error(`Le preset ${args.new} existe déjà`);
                    } else {
                        localPresets.renamePreset(args.old, args.new);
                        logger.log('done');
                    }
                }
            )
            .command(
                'list',
                'Afficher tous les presets',
                (y) => {
                },
                async (args) => {
                    let preset = await localPresets.listPresets();
                    let string = JSON.stringify(preset, undefined, 2);
                    string = string.replace(/\\\\/g, '\\');
                    console.log(string);
                }
            )
            .command(
                'clear',
                'Supprimer tous les presets',
                (y) => {
                },
                (args) => {
                    localPresets.clearPresets();
                    console.log('done');
                }
            )
            .command(
                'import <file>',
                "Importer une liste de presets d'un fichier json ou un preset partagé",
                (y) =>
                    y.positional('file', {
                        type: 'string',
                        describe: 'Fichier json',
                    }),
                async (args) => {
                    let file = await stat(args.file);
                    if (!file.isFile) {
                        console.error(`Le fichier ${args.file} n'existe pas`);
                        return;
                    }
                    await localPresets.importPresets(args.file);
                    console.log('done');
                }
            )
            .command(
                'remove <preset>',
                'Supprimer un preset',
                (y) =>
                    y.positional('preset', {
                        type: 'string',
                        describe: 'Nom du groupe',
                    }),
                async (args) => {
                    localPresets.removePreset(args.preset);
                    console.log('done');
                }
            )
            .demandCommand(1, '')
            .strict()
            .showHelpOnFail(true),
];


module.exports = {
    initCmd,
    cpmCmd,
    lstCmd,
    preCmd
};