const groupby = [
    'groupby',
    {
        type: 'string',
        default: undefined,
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
        default: undefined,
        describe:
            'Compiler les fichiers individuellement même si source est un répertoire',
    },
];

const results = [
    'results',
    {
        choices: ['none', 'csv', 'json'],
        default: 'csv',
        describe: 'Affiche les résultats finaux',
    },
];

const watch = [
    'watch',
    {
        type: 'integer',
        default: 1000,
        describe: 'Observe et recompile les fichiers lors de la correction (pas encore implanté)',
    },
];

const tagPattern = [
    'tag-pattern',
    {
        type: 'string',
        default: undefined,
        describe: "Définir le patron des 'tags' des commentaires selon une expression régulière "
    }
];

const gridout = [
    'gridout',
    {
        choices: ['none', 'csv', 'json'],
        default: 'none',
        describe:
            'Exporter les commentaires contenus dans chaque groupe dans un fichier par groupe',
    }
]

const string = `[${groupby[0]}] [${pattern[0]}] [${exclude[0]}] [${parts[0]}] [${single[0]}] [${tagPattern[0]}] [${results[0]}]`;

module.exports = {
    groupby,
    pattern,
    exclude,
    parts,
    single,
    results,
    watch,
    tagPattern,
    string,
}