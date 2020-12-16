const {
  createCommentParser,
  createResultParser,
  createParser,
} = require('../src/compiler/parser.builder');

const {asDatabase} = require('../src/compiler/comments');

const { expect } = require('chai');

describe('Parser builders', () => {
  describe('#createCommentParser', () => {
    it('should parse any comments', () => {
      let txt =
        'blahhh blah <!-- comment <!--\ninline --> blah\nblahhh blah // comment \nf vf/*inline */ blah';
      let p = createCommentParser();

      let a = p.parse(txt);
      expect(a.content).to.deep.equal(' comment <!--\ninline ');
      expect(a.first).to.equal(12);
      expect(a.last).to.equal(39);
      expect(a.begin).to.equal('<!--');
      expect(a.end).to.equal('-->');
      expect(p.parse(txt).content).to.deep.equal(' comment ');
      expect(p.parse(txt).content).to.deep.equal('inline ');
    });
  });

  describe('#createParser',  () => {
    it('should parse error with id', async() => {
      let text =
        'texte xtex xtext \n <!-- Err:(1) Message erruer --> ,\n text text';
      const db = asDatabase('./tests/commentaires.json');
      await db.load();
      let parser = createParser( db );
      let range = parser.parse(text);
      expect(range).to.have.property('id', "Err:(1)");
    });

    it('should parse multiple comments', async () => {
      let text =
          'text textec texte \n text /*   Err:(1) aaabbbbccc dddeeff    */ text \n text text  <!-- Err:(2) yo -->';
      const db = asDatabase('./tests/commentaires.json');
      await db.load();
      let parser = createParser(db);
      let range = parser.parse(text);
      expect(range).to.have.property('begin', '/*');
      expect(range).to.have.property('end', '*/');
      expect(range).to.have.property('id', 'Err:(1)');
      expect(range).to.have.property('first', 25);
      expect(range).to.have.property('last', 61);
      range = parser.parse(text);
      expect(range).to.have.property('begin', '<!--');
      expect(range).to.have.property('end', '-->');
      expect(range).to.have.property('id', 'Err:(2)');
      expect(range).to.have.property('first', 81);
      expect(range).to.have.property('last', 99);
      range = parser.parse(text);
      expect(range).to.be.null;
    });
  });

  describe('#createResultParser', () => {
    it('should parse result with int values', () => {
      let text = 'texte xtex xtext \n <!--Résultat:5/10--> ,\n text text';
      let parser = createResultParser('Résultat:');
      let range = parser.parse(text);
      expect(range.result).to.have.property('numerator', 5);
      expect(range.result).to.have.property('denominator', 10);
    });

    it('should parse result with float values', () => {
      let text =
        'texte xtex xtext \n <!--Résultat:     5.4/10--> ,\n text text';
      let parser = createResultParser('Résultat:');
      let range = parser.parse(text);
      expect(range.result).to.have.property('numerator', 5.4);
      expect(range.result).to.have.property('denominator', 10);
    });
  });
});
