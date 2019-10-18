import { Parser, TagParser, ErrorParser, ResultParser } from '../src/parser';
import { expect } from 'chai';

describe('TagParser', () => {
  describe('#parse', () => {
    it('should parse comments <!-- comment --> using a given tag', () => {
      let text =
        'text textec texte \n text <!--   bob: aaabbbbccc dddeeff    --> text \n text text';
      let tag = 'bob:';
      let parser = new TagParser(tag);
      let range = parser.parse(text);
      expect(range).to.have.property('prefix', '<!--');
      expect(range).to.have.property('suffix', '-->');
      expect(range).to.have.property('tag', 'bob:');
      expect(range).to.have.property('content', 'aaabbbbccc dddeeff');
      expect(range).to.have.property('first', 25);
      expect(range).to.have.property('last', 62);
    });

    it('should parse comments /* comment */ using a given tag', () => {
      let text =
        'text textec texte \n text /*   bob: aaabbbbccc dddeeff    */ text \n text text';
      let tag = 'bob:';
      let parser = new TagParser(tag);
      let range = parser.parse(text);
      expect(range).to.have.property('prefix', '/*');
      expect(range).to.have.property('suffix', '*/');
      expect(range).to.have.property('tag', 'bob:');
      expect(range).to.have.property('content', 'aaabbbbccc dddeeff');
      expect(range).to.have.property('first', 25);
      expect(range).to.have.property('last', 59);
    });

    it('should parse comments a pattern tag', () => {
      let text =
        'text textec texte \n text /*   bill: aaabbbbccc dddeeff    */ text \n text text';
      let tag = '(bob|bill):';
      let parser = new TagParser(tag);
      let range = parser.parse(text);
      expect(range).to.have.property('prefix', '/*');
      expect(range).to.have.property('suffix', '*/');
      expect(range).to.have.property('tag', 'bill:');
      expect(range).to.have.property('content', 'aaabbbbccc dddeeff');
      expect(range).to.have.property('first', 25);
      expect(range).to.have.property('last', 60);
    });

    it('should parse multiple comments', () => {
      let text =
        'text textec texte \n text /*   bill: aaabbbbccc dddeeff    */ text \n text text  <!-- bob: yo -->';
      let tag = '(bob|bill):';
      let parser = new TagParser(tag);
      let range = parser.parse(text);
      expect(range).to.have.property('prefix', '/*');
      expect(range).to.have.property('suffix', '*/');
      expect(range).to.have.property('tag', 'bill:');
      expect(range).to.have.property('content', 'aaabbbbccc dddeeff');
      expect(range).to.have.property('first', 25);
      expect(range).to.have.property('last', 60);
      range = parser.parse(text);
      expect(range).to.have.property('prefix', '<!--');
      expect(range).to.have.property('suffix', '-->');
      expect(range).to.have.property('tag', 'bob:');
      expect(range).to.have.property('content', 'yo');
      expect(range).to.have.property('first', 79);
      expect(range).to.have.property('last', 95);
      range = parser.parse(text);
      expect(range).to.be.null;
    });
  });
});

describe('ErrorParser', () => {
  describe('#parse', () => {
    it('should parse error with id', () => {
      let text = 'texte xtex xtext \n <!-- Err: (45) Message erruer --> ,\n text text';
      let parser = new ErrorParser();
      let range = parser.parse(text);
      expect(range).to.have.property('id', 45);
    });
  });
});


describe('ResultParser', () => {
  describe('#parse', () => {
    it('should parse result with int values', () => {
      let text = 'texte xtex xtext \n <!--Résultat:5/10--> ,\n text text';
      let parser = new ResultParser('Résultat:');
      let range = parser.parse(text);
      expect(range).to.have.property('result', 5);
      expect(range).to.have.property('points', 10);
    });

    it('should parse result with float values', () => {
      let text = 'texte xtex xtext \n <!--Résultat:     5.4/10.1--> ,\n text text';
      let parser = new ResultParser('Résultat:');
      let range = parser.parse(text);
      expect(range).to.have.property('result', 5.4);
      expect(range).to.have.property('points', 10.1);
    });
  });
});