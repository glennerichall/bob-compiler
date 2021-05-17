const path = require('path');
let sep = path.sep;

module.exports =
    {
        devoirs: (devoir) => {
            let etudiant = `(?<etudiant>[^${sep}]+)`;
            let version = "Version \\d";
            let others = `(.*${sep})*`;
            let fichier = `[^${sep}]+`;
            let extensions = "\\.(java|xml|gradle|cs|xaml|html|css|js|sql)$";
            let pattern = `${etudiant}${sep}${devoir}${sep}${version}${sep}${others}${fichier}${extensions}`;

            let exclude = [
                'bin',
                'obj',
                '.idea',
                '.gradle',
                'build',
                'node_modules'
            ]

            return {
                groupby: "etudiant",
                pattern,
                exclude: "(" + exclude.map(x=>`${sep}${x}${sep}`).join('|') + ")",
                parts: "resolve"
            }
        }
    };