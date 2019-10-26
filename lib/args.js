"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preCmd = exports.lstCmd = exports.cpmCmd = void 0;

var _cliCompile = require("./cli-compile.js");

var _cliPresets = require("./cli-presets.js");

const groupby = ['groupby', {
  type: 'string',
  default: process.env.bobcgroupby,
  describe: "Grouper les fichiers selon les groupes nommés dans l'expression régulière déterminée par l'option [pattern]"
}];
const pattern = ['pattern', {
  type: 'string',
  default: process.env.bobcpattern || '.*',
  describe: 'Filtrer les fichiers selon une expression régulière'
}];
const parts = ['parts', {
  choices: ['basename', 'dirname', 'extname', 'resolve'],
  default: 'basename',
  describe: 'Considérer seulement certaines parties du nom de fichier dans le filtre [pattern]'
}];
const single = ['single', {
  type: 'boolean',
  describe: 'Compiler les fichiers individuellement même si [source] fait référence à un répertoire'
}]; // ---------------------------------------------------------------------------

const cpmCmd = ['compile <source> <commentaires> [groupby] [pattern] [parts] [single] [preset]', 'Compiler les points des commentaires annotés dans les fichiers.', y => y.positional('source', {
  type: 'string',
  describe: 'Chemin de fichier ou de répertoire contenant le groupe de fichiers à compiler.'
}).positional('commentaires', {
  type: 'string',
  describe: 'Chemin de fichier contenant la liste des commentaires et leur pondération.'
}).option(...groupby).option(...pattern).option(...parts).option(...single).option('preset', {
  type: 'array',
  default: [],
  describe: "Ensemble(s) d'arguments pré-déterminés (Voir commande [preset])"
}).implies('groupby', 'pattern').implies('parts', 'pattern'), async args => {
  const {
    source,
    commentaires
  } = args;
  await (0, _cliCompile.compile)(source, commentaires, args);
}]; // ---------------------------------------------------------------------------

exports.cpmCmd = cpmCmd;
const lstCmd = ['list <commentaires>', 'Afficher la liste des commentaires contenu dans le fichier', y => y.positional('commentaires', {
  type: 'string',
  describe: 'Chemin de fichier contenant la liste des commentaires et leur pondération.'
}), args => {
  const {
    commentaires
  } = args;
}]; // ---------------------------------------------------------------------------

exports.lstCmd = lstCmd;
const preCmd = ['presets <action> [preset] [groupby] [pattern] [parts] [single]', "Ajouter un ensemble d'arguments pré-déterminés", y => {
  y.positional('action', {
    choices: ['add', 'remove', 'list', 'clear']
  });
  y.positional('preset', {
    type: 'string',
    describe: 'Nom du preset'
  }).option(...groupby).option(...pattern).option(...parts).option(...single);
}, args => {
  if (args.action == 'add') {
    (0, _cliPresets.setPreset)(args, args);
  } else if (args.action == 'clear') {
    (0, _cliPresets.clearPresets)();
  } else if (args.action == 'list') {
    console.log((0, _cliPresets.listPresets)());
  }
}];
exports.preCmd = preCmd;