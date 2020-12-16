const cli = require('../src/index');
const {expect} = require('chai');
const version = require('../src/version');

describe('Cli', () => {

    it('should show --version', async () => {
        const argv = [
            '--version'
        ];
        const v = await version();
        const log = console.log.bind(console);
        let output = '';
        console.log = msg=>output += msg;
        await cli(argv);
        expect(output).to.equal(v);
        console.log = log;
    });

    it('should show help', async () => {
        const argv = [ ];
        const log = console.error.bind(console);
        let output = '';
        console.error = msg=>output += msg;
        await cli(argv);
        expect(output).to.equal('bobc <cmd> [args]\n' +
            '\n' +
            'Commands:\n' +
            '  bobc list <commentaires>                                                                                                                         Afficher la liste des commentaires contenu dans le fichier\n' +
            '  bobc presets                                                                                                                                     Gérer les groupes d\'arguments prédéfinis (preset)\n' +
            '  bobc compile <source> <commentaires> [groupby] [pattern] [exclude] [parts] [single] [tag-pattern] [results] [preset] [watch] [verbose] [preset]  Compiler les points des commentaires annotés dans les fichiers.\n' +
            '  bobc init [preset]                                                                                                                               Créer des fichiers de scripts pour faciliter la correction.\n' +
            '\n' +
            'Options:\n' +
            '  --help     Show help  [boolean]\n' +
            '  --version  Show version number  [boolean]undefined');
        console.error = log;
    });

    it('should new version', async () => {
        const argv = [ '--version' ];
        const log = console.warn.bind(console);
        let output = '';
        console.warn = msg=>output += msg;
        await cli(argv, 'v0');
        expect(output).to.match(/Newer version available \d+\.\d+\.\d+, consider upgrading it \(npm upgrade -g bob-compiler\)/);
        console.warn = log;
    });
});