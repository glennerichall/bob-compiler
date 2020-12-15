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
        describe: 'Observe et recompile les fichiers lors de la correction (pas enconre implanté)',
    },
];

module.exports = {
    groupby,
    pattern,
    parts,
    single,
    results,
    watch
}