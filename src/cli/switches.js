const groupby = [
    'groupby',
    {
        type: 'string',
        describe: "Grouper les fichiers selon les groupes définis dans l'expression régulière [pattern]",
    },
];

const pattern = [
    'pattern',
    {
        type: 'string',
        default: '.*',
        describe: 'Filtrer les fichiers selon une expression régulière. Voir également [gropuby] et [parts]',
    },
];

const exclude = [
    'exclude',
    {
        type: 'string',
        default: null,
        describe: 'Exclure certains fichiers selon une expression régulière'
    }
];

const parts = [
    'parts',
    {
        choices: ['basename', 'dirname', 'extname', 'resolve'],
        default: 'basename',
        describe: "Considérer seulement certaines parties du nom de fichier lors de l'application du paramètre [pattern]",
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
        describe: 'Observe et recompile les fichiers lors de la correction (pas encore implanté)',
    },
];

module.exports = {
    groupby,
    pattern,
    exclude,
    parts,
    single,
    results,
    watch
}