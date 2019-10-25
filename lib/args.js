"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lstCmd = exports.cpmCmd = void 0;

var _cli = require("./cli.js");

// ---------------------------------------------------------------------------
const cpmCmd = ['compile <source> <commentaires> [groupby] [pattern]', 'Compiler les points des commentaires annotés dans les fichiers.', y => y.positional('source', {
  type: 'string',
  describe: 'Chemin de fichier ou de répertoire contenant le groupe de fichiers à compiler.'
}).positional('commentaires', {
  type: 'string',
  describe: 'Chemin de fichier contenant la liste des commentaires et leur pondération.'
}).option('groupby', {
  type: 'string',
  default: process.env.bobcgroupby,
  describe: "Grouper les fichiers selon les greoupes nommés dans l'expression régulière déterminé par l'option [pattern]"
}).option('pattern', {
  type: 'string',
  default: process.env.bobcpattern || '.*',
  describe: 'Filtrer les fichiers selon une expression régulière'
}).option('parts', {
  choices: ['basename', 'dirname', 'extname', 'fullname', 'resolve'],
  default: 'basename',
  describe: 'Considérer seulement certaines parties du nom de fichier dans le filtre [pattern]'
}).coerce('parts', parts => parts.replace(/^fullname$/, 'resolve')).implies('groupby', 'pattern').implies('parts', 'pattern'), async args => {
  const {
    source,
    commentaires
  } = args;
  await (0, _cli.compile)(source, commentaires, args);
}]; // ---------------------------------------------------------------------------

exports.cpmCmd = cpmCmd;
const lstCmd = ['list <commentaires>', 'Afficher la liste des commentaires contenu dans le fichier', y => y.positional('commentaires', {
  type: 'string',
  describe: 'Chemin de fichier contenant la liste des commentaires et leur pondération.'
}), args => {
  const {
    commentaires
  } = args;
}];
exports.lstCmd = lstCmd;