import { compile } from './cli.js';

// ---------------------------------------------------------------------------
export const cpmCmd = [
  'compile <source> <commentaires> [groupby] [pattern]',
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
      .option('groupby', {
        type: 'string',
        default: process.env.bobcgroupby,
        describe:
          "Grouper les fichiers selon les greoupes nommés dans l'expression régulière déterminé par l'option [pattern]"
      })
      .option('pattern', {
        type: 'string',
        default: process.env.bobcpattern || '.*',
        describe: 'Filtrer les fichier selon une expression régulière'
      })
      .implies('groupby', 'pattern'),
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
