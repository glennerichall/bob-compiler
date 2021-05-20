const {list, compile, presets, init} = require('./verbs');
const {parse} = require('./parse');
const fs = require('fs');

module.exports = yargs =>
    yargs
        .scriptName('bobc')
        .usage('$0 <cmd> [args]')
        .command(...list)
        .command(...presets)
        .command(...compile)
        .command(...init)
        .command(
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
            },
            async args => {

                let tagPattern = args.pattern ??
                    '((?<nom>err|question|q|etc|lab|laboratoire|travail|tr|devoir|dev)\\.?(?<numero>\\d+(\\.\\d+)*))';

                let commentaires = await parse(args.source, tagPattern);

                // trier avec des numéros et sous-numéros
                let ids = Object.keys(commentaires);
                if (args.pattern === null) {

                    const reg = new RegExp(tagPattern);

                    ids.sort((a, b) => {
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
                    });
                }

                let file = 'Total: auto\n';
                console.log('Total: auto');
                for (let id of ids) {
                    let line = `${commentaires[id].points}\t${id}\t${commentaires[id].description}`;
                    console.log(line);
                    if (args.output) {
                        file += line + '\n';
                    }
                }
                if (args.output) {
                    try {
                        fs.writeFileSync(args.output, file);
                    } catch (err) {
                        console.error(err)
                    }
                }
            }
        )
        .wrap(yargs.terminalWidth())
        .demandCommand(1, '')
        .strict()
        .showHelpOnFail(true)
        .exitProcess(false)
        .help();