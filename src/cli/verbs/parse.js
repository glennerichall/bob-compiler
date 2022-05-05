const fs = require('fs');
const path = require('path');
const logger = require('../../logger');
const {parse} = require('../parse');
const {standardValidChars, comment} = require("../../compiler/patterns");

const subSectionSorter = reg => (a, b) => {
    let m1 = reg.exec(a);
    let m2 = reg.exec(b);

    let nom1 = m1.groups.nom;
    let nom2 = m2.groups.nom;

    let n1 = m1.groups.numero;
    let n2 = m2.groups.numero;

    let d1 = nom1.localeCompare(nom2);

    if (d1 !== 0) {
        return d1;
    }

    let arr1 = n1.split('.').map(x => Number.parseInt(x));
    let arr2 = n2.split('.').map(x => Number.parseInt(x));

    for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
        let d2 = arr1[i] - arr2[i];
        if (d2 !== 0) {
            return d2;
        }
    }

    return arr1.length - arr2.length;
}

const medianSorter = (reg) => {
    let sorter = subSectionSorter(reg);
    return (a, b) => sorter(a.median, b.median);
}

module.exports = [
    'parse <source> [pattern] [verbose] [output]',
    'Analyser une solution contenant les pondérations pour générer un fichier commentaires',
    y => {
        y.positional(
            'source',
            {
                type: 'string',
                describe: 'Chemin de fichier contenant les fichiers de la solution',
            }
        ).option(
            'pattern',
            {
                type: 'string',
                describe: 'Expression régulière définissant les tags des commentaires',
                default: null
            }
        ).option('output', {
            type: "string",
            describe: 'Écrit la sortie dans un fichier'
        }).option('verbose',
            {
                type: 'boolean',
                describe: 'Exécution verbeuse',
            })
    }
    ,
    async args => {

        // #70:
        // On capture la pondération pour pouvoir capture n'importe quel genre de tag.
        // Voir cli\parse.js #96
        let tagPattern;
        let tagComment;
        if (args.pattern) {
            tagPattern = `((?<nom>${args.pattern})\\.?(?<numero>${standardValidChars}))`;
        } else {
            tagPattern = `((?<nom>err|question|q|etc|lab|laboratoire|travail|tr|devoir|dev|som|sommatif)\\.?(?<numero>${standardValidChars}))`;
        }
        tagComment = `(?<ponderation>\\d+(\\.\\d+)?)\\s+${tagPattern}`;


        logger.info('Tag pattern to match: ' + tagPattern);
        logger.info('Tag comment to match: ' + tagComment);
        // Afficher à l'écran et dans le fichier si nécessaire
        // le total auto
        console.log('Total: auto');
        let file = 'Total: auto\n';

        // Ajouter les warnings dans le fichier de sortie
        logger.onWarn = msg => {
            file += '# (Warning) ' + msg + '\n';
        };

        // obtenir les commentaires depuis la solution
        let {result, filenames, total} = await parse(args.source, tagComment);

        // regrouper les fichiers du même nom (par exemple pour les ressources Android)
        filenames = Object.keys(filenames).reduce((prev, cur) => {
            let filename = path.basename(cur);
            if (!prev[filename]) prev[filename] = [];
            prev[filename].push(...filenames[cur]);
            return prev;
        }, {});

        const reg = new RegExp(tagPattern);
        let files = Object.keys(filenames);

        if (args.pattern === null) {
            let medians = [];

            // trier les fichiers selon le tag median de chaque fichier

            // calculer les tag medians
            for (let filename in filenames) {
                // obtenir les ids des tags du fichier
                let ids = filenames[filename]

                // trier avec des numéros et sous-numéros
                ids.sort(subSectionSorter(reg));

                let median = ids[Math.floor(ids.length / 2)];
                medians.push({
                    filename,
                    median
                });
            }

            // trier les fichiers selon le median
            medians.sort(medianSorter(reg));

            // obtenir la liste de fichiers triées
            files = medians.map(x => x.filename);
        }

        for (let filename of files) {
            let stot = 0;

            // obtenir les tags pour le fichier en cours
            let commentaires = filenames[filename].reduce((res, id) => {
                res[id] = result[id];
                return res;
            }, {});

            // obtenir les ids des tags du fichier
            // pourrait-être aussi let ids = filenames[filename]
            let ids = Object.keys(commentaires);

            // trier avec des numéros et sous-numéros
            if (args.pattern === null) {
                ids.sort(subSectionSorter(reg));
            }

            console.log('\n# --------------------------------------------------------------------------------------');
            console.log(`# ${path.basename(filename)}`);
            console.log('# --------------------------------------------------------------------------------------');
            file += '\n# --------------------------------------------------------------------------------------';
            file += `\n# ${path.basename(filename)}`;
            file += '\n# --------------------------------------------------------------------------------------\n';

            for (let id of ids) {
                let line = `${commentaires[id].points}\t${id}\t${commentaires[id].description}`;
                stot += commentaires[id].points > 0 ? commentaires[id].points : 0;
                console.log(line);
                file += line + '\n';
            }

            console.log('# --------------------------------------------------------------------------------------');
            console.log(`# Sous-total: ${stot}`);

            file += '\n# --------------------------------------------------------------------------------------';
            file += `\n# Sous-total: ${stot}`

        }

        console.log('\n# --------------------------------------------------------------------------------------');
        console.log(`# Total: ${total}`);
        console.log('# --------------------------------------------------------------------------------------');
        file += '\n# --------------------------------------------------------------------------------------';
        file += `\n# Total: ${total}`;
        file += '\n# --------------------------------------------------------------------------------------\n';

        if (args.output) {
            try {
                fs.writeFileSync(args.output, file);
            } catch (err) {
                console.error(err)
            }
        }
    }
];