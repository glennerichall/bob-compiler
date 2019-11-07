import { getGroups, compileGroup, compile } from '../src/cli/cli-compile.js';
import { expect } from 'chai';

describe('cli-compile', () => {
  describe('#getGroups', () => {
    it('should get group all files in a single group by default', async () => {
      let files = await getGroups('./tests/folders');
      expect(files).to.have.length(10);
    });

    it('should filter using regexp pattern', async () => {
      let files = await getGroups('./tests/folders', {
        pattern: '.*.toto',
        parts: 'resolve'
      });
      expect(files).to.have.length(4);
    });

    it('should group by regexp pattern', async () => {
      let files = await getGroups('./tests/folders', {
        pattern: '(?<name>.*).(toto|bob)',
        parts: 'basename',
        groupby: 'name'
      });
      expect(files).to.have.keys(['a', 'b', 'c']);
      expect(files.a).to.have.length(4);
      expect(files.b).to.have.length(4);
      expect(files.c).to.have.length(2);
    });
  });

  describe('#compileGroup', () => {
    it('should return results', async () => {
      const base = './tests/testunits/420-1W1-AA/Sommatif 2';
      const source = base;
      const commentaires = `${base}/commentaires`;
      let results = await compileGroup(source, commentaires, {
        pattern:
          '^(?<codepermanent>\\w{4}\\d{6,8})-(?<travail>\\w+)-(?<numero>\\d+)\\.(?<lang>css|html|js)$',
        parts: 'basename',
        groupby: 'codepermanent',
        dryrun: true
      });
      expect(results).to.deep.equal({
        RAZA641201: 17,
        LARA69060208: 18,
        LAPA83120105: 11,
        STPD29039407: 10,
        girf72020106: 9.5,
        BILG12109904: 20,
        imbk25099802: 17,
        BROL83530202: 18.5,
        BOUM73120107: 16,
        BRIO77040208: 16,
        MOSP020598: 15.5,
        BRAP76070002: 18,
        AUDT82010105: 18.5,
        SAVV67010207: 17.5,
        LAVX76010201: 17,
        BRAY160298: 0,
        GUIY210383: 11,
        BONZ66090109: 15.5,
        BOUE80050101: 1,
        BRIL011099: 14.5
      });
    });
  });

  describe('#compile', () => {
    it('should print results in json', async () => {
      const base = './tests/testunits/420-1W1-AA/Sommatif 2';
      const source = base;
      const commentaires = `${base}/commentaires`;
      let output = '';
      let log = console.log.bind(console);
      console.log = msg => (output += msg);
      await compile(source, commentaires, {
        pattern:
          '^(?<codepermanent>\\w{4}\\d{6,8})-(?<travail>\\w+)-(?<numero>\\d+)\\.(?<lang>css|html|js)$',
        parts: 'basename',
        groupby: 'codepermanent',
        results: 'json',
        dryrun: true
      });
      let expected = {
        RAZA641201: 17,
        LARA69060208: 18,
        LAPA83120105: 11,
        STPD29039407: 10,
        girf72020106: 9.5,
        BILG12109904: 20,
        imbk25099802: 17,
        BROL83530202: 18.5,
        BOUM73120107: 16,
        BRIO77040208: 16,
        MOSP020598: 15.5,
        BRAP76070002: 18,
        AUDT82010105: 18.5,
        SAVV67010207: 17.5,
        LAVX76010201: 17,
        BRAY160298: 0,
        GUIY210383: 11,
        BONZ66090109: 15.5,
        BOUE80050101: 1,
        BRIL011099: 14.5
      };
      console.log = log;
      expect(JSON.parse(output)).to.deep.equal(expected);
    });

    it('should succeed another test', async () => {
      const base = './tests/testunits/420-1W1-AA/Examen 1';
      const source = base;
      const commentaires = `${base}/commentaires`;
      let output = '';
      let log = console.log.bind(console);
      console.log = msg => (output += msg);
      await compile(source, commentaires, {
        pattern:
          '.*\\\\(?<etudiant>[\\w\\u00C0-\\u00FF]+([\\s-][\\w\\u00C0-\\u00FF]+)+)_\\d+.*\\\\.*\\.(html|css)$',
        parts: 'resolve',
        groupby: 'etudiant',
        results: 'json',
        dryrun: true
      });
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
        'Yannick Guion-Firmin': 87
      };
      expect(JSON.parse(output)).to.deep.equal(expected);
    });
  });
});
