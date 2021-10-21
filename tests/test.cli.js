const cli = require('../src/index');
const {expect} = require('chai');
const version = require('../src/version');

describe('Cli', () => {

    it('should show --version', async () => {
        const argv = [
            '', '',
            '--version'
        ];
        const v = await version();
        const log = console.log.bind(console);
        let output = '';
        console.log = msg => output += msg;
        await cli(argv);
        expect(output).to.equal(v);
        console.log = log;
    });

    it('should show help', async () => {
        const argv = ['', ''];
        const log = console.error.bind(console);
        let output = '';
        console.error = msg => output += msg;
        await cli(argv);
        expect(output).to.equal(`bobc <cmd> [args]

Commands:
  bobc list <commentaires>                                                                                                                         Afficher la liste des commentaires contenu dans le fichier
  bobc presets                                                                                                                                     Gérer les groupes d'arguments prédéfinis (preset)
  bobc compile <source> <commentaires> [groupby] [pattern] [exclude] [parts] [single] [tag-pattern] [results] [preset] [watch] [verbose] [dryrun]  Compiler les points des commentaires annotés dans les fichiers.
  bobc init [preset] [devoir]                                                                                                                      Créer des fichiers de scripts pour faciliter la correction.
  bobc parse <source> [pattern] [verbose] [output]                                                                                                 Analyser une solution contenant les pondérations pour générer un fichier commentaires

Options:
  --help     Show help  [boolean]
  --version  Show version number  [boolean]undefined`);
        console.error = log;
    });

    it('should warn for new version', async () => {
        const argv = ['--version'];
        const log = console.warn.bind(console);
        let output = '';
        console.warn = msg => output += msg;
        await cli(argv, 'v0');
        expect(output).to.match(/Newer version available \d+\.\d+\.\d+, consider upgrading it \(npm upgrade -g bob-compiler\)/);
        console.warn = log;
    });

    it('should have default preset', async () => {
        let data = require('../src/cli/assets/presets').devoirs('toto tata');
        expect(data).to.have.property('groupby', 'etudiant');
        expect(data).to.have.property('parts', 'resolve');
        expect(data).to.have.property('exclude', '([/\\\\]bin[/\\\\]|[/\\\\]obj[/\\\\]|[/\\\\].idea[/\\\\]|[/\\\\].gradle[/\\\\]|[/\\\\]build[/\\\\]|[/\\\\]node_modules[/\\\\])');
        expect(data).to.have.property('pattern', '(?<etudiant>[^/\\\\]+)[/\\\\]toto tata[/\\\\]Version \\d[/\\\\](.*[/\\\\])*[^/\\\\]+\\.(java|xml|gradle|cs|xaml|html|css|js|sql)$');
    })
});