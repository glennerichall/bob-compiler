
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
        const { commentaires } = args;
    },
];

module.exports = lstCmd;