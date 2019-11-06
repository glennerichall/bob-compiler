import { compile } from './cli-compile.js';
import {
  setPreset,
  listPresets,
  clearPresets,
  removePreset,
  importPresets
} from './cli-presets.js';

const groupby = [
  'groupby',
  {
    type: 'string',
    describe: 'Grouper les fichiers selon les groupes nommés'
  }
];

const pattern = [
  'pattern',
  {
    type: 'string',
    default: '.*',
    describe: 'Filtrer les fichiers selon une expression régulière'
  }
];

const parts = [
  'parts',
  {
    choices: ['basename', 'dirname', 'extname', 'resolve'],
    default: 'basename',
    describe: 'Considérer seulement certaines parties du nom de fichier'
  }
];

const single = [
  'single',
  {
    type: 'boolean',
    describe:
      'Compiler les fichiers individuellement même si source est un répertoire'
  }
];

const results = [
  'results',
  {
    choices: ['none', 'csv', 'json'],
    describe: 'Affiche les résultats finaux'
  }
];

// ---------------------------------------------------------------------------
export const cpmCmd = [
  'compile <source> <commentaires> [groupby] [pattern] [parts] [single] [preset] [results] [verbose] [dryrun]',
  'Compiler les points des commentaires annotés dans les fichiers.',
  y =>
    y
      .positional('source', {
        type: 'string',
        describe:
          'Chemin de fichier ou de répertoire contenant le groupe de fichiers à compiler.'
      })
      .positional('commentaires', {
        type: 'string',
        describe:
          'Chemin de fichier contenant la liste des commentaires et leur pondération.'
      })
      .option(...groupby)
      .option(...pattern)
      .option(...parts)
      .option(...single)
      .option(...results)
      .option('preset', {
        type: 'array',
        default: [],
        describe: "Ensemble(s) d'arguments prédéfinis (Voir commande [preset])"
      })
      .option('verbose', {
        type: 'boolean',
        describe: 'Exécution verbeuse'
      })
      .option('dryrun', {
        type: 'boolean',
        describe: 'Ne pas exécuter la commande'
      })
      .middleware([
        argv => {
          if (argv['_'][0] == 'compile') {
            if (argv.verbose) console.log('Applying presets');
            let presets = applyPresets(argv.preset || []);
            for (let key of Object.keys(presets)) {
              argv[key] = presets[key];
            }
          }
        }
      ])
      .implies('groupby', 'pattern')
      .implies('parts', 'pattern'),
  async args => {
    const { source, commentaires } = args;
    await compile(source, commentaires, args);
  }
];

// ---------------------------------------------------------------------------
export const lstCmd = [
  'list <commentaires>',
  'Afficher la liste des commentaires contenu dans le fichier',
  y =>
    y.positional('commentaires', {
      type: 'string',
      describe:
        'Chemin de fichier contenant la liste des commentaires et leur pondération.'
    }),
  args => {
    const { commentaires } = args;
  }
];

// ---------------------------------------------------------------------------
export const preCmd = [
  'presets',
  "Gérer les groupes d'arguments prédéfinis",
  yargs =>
    yargs
      .usage('$0 presets <cmd> [args]')
      .command(
        'add <preset> [groupby] [pattern] [parts] [single] [results]',
        "Ajouter un groupe d'arguments",
        y =>
          y
            .positional('preset', {
              type: 'string',
              describe: "Nom du groupe d'arguments"
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
              args =>
                args.groupby != undefined ||
                args.pattern != undefined ||
                args.parts != undefined ||
                args.results != undefined ||
                args.single != undefined
            ),
        args => setPreset(args, args)
      )
      .command(
        'list',
        "Afficher tous les groupes d'arguents prédéfinis",
        y => {},
        args => console.log(listPresets())
      )
      .command(
        'clear',
        "Supprime tous les groupes d'arguments prédéfinis",
        y => {},
        args => clearPresets()
      )
      .command(
        'import <file>',
        "Import une liste d'argument prédéfinis à partir d'un fihier json",
        y =>
          y.positional('file', {
            type: 'string',
            describe: 'Fichier json'
          }),
        async args => importPresets(args.file)
      )
      .command(
        'remove <preset>',
        "Supprime un groupe d'arguments prédéfinis",
        y =>
          y.positional('preset', {
            type: 'string',
            describe: 'Nom du groupe'
          }),
        args => removePreset(args.preset)
      )
      .demandCommand(1, '')
      .strict()
      .showHelpOnFail(true)
];
