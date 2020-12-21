const {
    getGroups,
    compileGroup,
    compile,
} = require('../src/cli/compile.js');
const {Comment, Compiler} = require('../src/compiler/compiler.js');
const {expect} = require('chai');
const logger = require('../src/logger');
const {readFile} = require('fs').promises;

const {levels} = logger;
if (process.env.trace === 'on') {
    logger.level = levels.trace;
}

describe('issues', () => {
    it('should succeed test files 1', async () => {
        if (process.env.TRAVIS) return;
        const base = './tests/testunits/420-1W1-AA/Examen 1';
        const source = base;
        const commentaires = `${base}/commentaires`;
        let output = '';
        let log = console.log.bind(console);
        console.log = (msg) => (output += msg);
        await compile(source, commentaires, {
            pattern:
                '.*(\\\\|/)(?<etudiant>[\\w\\u00C0-\\u00FF]+([\\s-][\\w\\u00C0-\\u00FF]+)+)_\\d+.*(\\\\|/).*\\.(html|css)$',
            parts: 'resolve',
            groupby: 'etudiant',
            results: 'json',
            dryrun: true,
        });
        console.log = log;
        let expected = {
            'Alexandre Laroche': 98,
            'Alexis Lapointe': 91,
            'Gabriel Bilodeau': 96,
            'Gabriel Larouche': 98,
            'Keven Imbeault': 99,
            'Olivier Briand': 99,
            'Paul Mossmann': 97,
            'Pierre-Émile Brassard': 98,
            'Quentin Mante': 77,
            'Tristan Audet': 97.5,
            'Victor Savard-Arseneault': 99,
            'Younès Braz': 94.5,
            'Zackary Bonneau': 100,
            'Émile Boucher': 60.5,
            'Adrien Razafimahatratra': 99,
            'Axel Liam Fongue Fono': 96,
            'David St-Pierre': 92,
            'Francis Girard': 84.5,
            'Lucas Bringe': 95,
            'Léa Brouillette': 100,
            'Maxime Bouchard': 100,
            'Vincent Kotarski': 95.5,
            'Xavier Lavoie': 99,
            'Yannick Guion-Firmin': 87,
        };
        expect(JSON.parse(output)).to.deep.equal(expected);
    });

    it('should succeed test files 2', async () => {
        if (process.env.TRAVIS) return;

        const base = './tests/testunits/420-3N1-AA/Sommatif 1';
        const source = base;
        const commentaires = `${base}/commentaires.txt`;
        let output = '';
        let log = console.log.bind(console);
        console.log = (msg) => (output += msg);
        await compile(source, commentaires, {
            pattern:
                '.*(\\\\|/)(?<etudiant>[\\w\\u00C0-\\u00FF]+([\\s-][\\w\\u00C0-\\u00FF]+)+)_\\d+.*(\\\\|/).*\\.(cs|xaml)$',
            parts: 'resolve',
            groupby: 'etudiant',
            results: 'json',
            dryrun: true,
        });
        let expected = {
            'Francis Guindon': 19.5,
            'François Gagnon': 18.5,
            'Guy Williams Bossakene': 17,
            'Julien Jennequin': 13.5,
            'Kevin Francis Jean-Paul Richard Lasserre': 16.5,
            'Nicola Martel': 12,
            'Raphael Hudon-Murray': 19,
            'Simon-Olivier Lachance-Gagné': 17,
            'Vincent Lechasseur': 16.5,
        };
        // log(output);
        // log(JSON.parse(output,null,2));
        expect(JSON.parse(output)).to.deep.equal(expected);
    });

    it('should fix issue #18', async () => {
        const base = './tests/testunits/420-1W1-AA/Sommatif 3';
        const file = `${base}/RAZA64120103/RAZA64120103-sommatif-Q2.html`;
        const db = `${base}/commentaires`;

        const compiler = new Compiler(file, db);
        compiler.document.save = () => {};
        await compiler.load();
        await compiler.execute();

        const expected = ['<!-- Résultat: 15/15 -->', '<!DOCTYPE html>'];

        expect(compiler.document.content.split('\n')[0].trim()).to.be.equal(
            expected[0]
        );
        expect(compiler.document.content.split('\n')[1].trim()).to.be.equal(
            expected[1]
        );
    });

    it('should fix issue #18', async () => {
        const base = './tests/testunits/420-1W1-AA/Sommatif 3';
        const file = `${base}/RAZA64120103/RAZA64120103-sommatif-3-Q1.js`;
        const db = `${base}/commentaires`;

        const compiler = new Compiler(file, db);
        compiler.document.save = () => {};
        await compiler.load();
        await compiler.execute();

        const expected = [
            '/* Résultat: 15/15 */',
            'var codePermanent = prompt("Entrer votre code permanent.");',
        ];

        expect(compiler.document.content.split('\n')[0].trim()).to.be.equal(
            expected[0]
        );
        expect(compiler.document.content.split('\n')[1].trim()).to.be.equal(
            expected[1]
        );
    });

    it('should fix issue #22', async () => {
        const base = './tests/testunits/420-3N1-AA/Sommatif 2';
        const file = `${base}/MainWindow.xaml.cs`;
        const db = `${base}/commentaires.txt`;

        const compiler = new Compiler(file, db);
        compiler.document.save = () => {};
        await compiler.load();
        await compiler.execute();

        expect(compiler.document.content.split('\n')[58].trim()).to.be.equal(
            '/*  Err(10) Erreur: Placer la photo absent.png dans les resources, (-1 point) */'
        );
        expect(compiler.document.content.split('\n')[82].trim()).to.be.equal(
            "//  Err(11) Erreur: Vérifier que l'index est à l'intérieur des limites de la grille, (-1 point)"
        );
    });

    it('should succeed test files 3', async () => {
        if (process.env.TRAVIS) return;

        const base = './tests/testunits/420-1W1-AA/Examen 2';
        const source = base;
        const commentaires = `${base}/commentaires`;
        let output = '';
        let log = console.log.bind(console);
        console.log = (msg) => (output += msg);
        await compile(source, commentaires, {
            pattern:
                '(?<codepermanent>[a-zA-Z]{4}\\d{6,8})-(?:sommatif|formatif|examen)-\\d{1,2}\\.(?:html|css|js)$',
            parts: 'resolve',
            groupby: 'codepermanent',
            results: 'json',
            dryrun: true,
        });
        let expected = {
            "BILG12109904": 1,
            "BOUT64110104": 0,
            "DOUE71120200": 0,
            "LAVD12109401": 0,
            "ROYL90020000": 0,
            "mort75100103": 0,
        };
        // log(output);
        // log(JSON.parse(output,null,2));
        expect(JSON.parse(output)).to.deep.equal(expected);
    })

    it('should calculate correctly total', async () => {
        const base = './tests/testunits/420-1W1-AA/Examen 2';
        let file = `${base}/BILG12109904-examen-2.html`;
        const commentaires = `${base}/commentaires`;
        const compiler = new Compiler(file, commentaires);
        compiler.document.save = () => {
            // let content = compiler.document.content;
            // require('fs').writeFileSync('tests/saved-no-result.html', content, 'utf8');
        };
        await compiler.load();
        await compiler.execute();
        // let content = await readFile('tests/saved-no-result.html', 'utf8');
        let content = '';
        expect(compiler.document.content.split('\n')[0].trim())
            .to.be.equal('<!-- Résultat: 1/34 -->');
    });

    it('should machin fucking truc', async () => {
        const base = './tests/testunits/420-1W1-AA/Examen 2';
        let file = `${base}/BILG12109904-examen-2.html`;
        const commentaires = `${base}/commentaires`;
        const compiler = new Compiler(file, commentaires);
        compiler.document.save = () => {
            // let content = compiler.document.content;
            // require('fs').writeFileSync('tests/BILG12109904-examen-2.html', content, 'utf8');
        };
        await compiler.load();
        await compiler.execute();
        let content = await readFile('tests/BILG12109904-examen-2.html', 'utf8');
        expect(compiler.document.content)
            .to.be.equal(content);
    });
});
