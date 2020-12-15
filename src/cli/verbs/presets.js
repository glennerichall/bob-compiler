const {
    groupby,
    pattern,
    parts,
    single,
    watch
} = require('../switches');

const localPresets = require('../cli-presets.js');
const logger = require('../../logger.js');

const add_args = '<preset> [groupby] [pattern] [parts] [single] [results]';

const check_exists = (preset) => {
    const presets = localPresets.listPresets();
    if (presets[preset] == undefined) {
        throw new Error(`Le preset ${preset} n'existe pas`);
    }
    return true;
};


const add_build = (y) =>
    y
        .positional('preset', {
            type: 'string',
            describe: 'Nom du preset',
        })
        .option(groupby[0], { ...groupby[1], default: undefined })
        .option(pattern[0], { ...pattern[1], default: undefined })
        .option(parts[0], { ...parts[1], default: undefined })
        .option(results[0], { ...results[1], default: undefined })
        .option(single[0], { ...single[1], default: undefined })
        .group(
            ['groupby', 'pattern', 'parts', 'results', 'single'],
            'Preset parameters'
        )
        .check(
            (args) =>
                args.groupby != undefined ||
                args.pattern != undefined ||
                args.parts != undefined ||
                args.results != undefined ||
                args.single != undefined
        );

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
                (y) => {},
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
                (y) => {},
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


module.exports = preCmd;