import {
  createTagInHtmlParser,
  createErrorInHtmlParser,
  createResultInHtmlParser
} from '../src/parser.builder';
import { expect } from 'chai';

describe('Parser builders', () => {
  describe('#createTagInHtmlParser', () => {
    it('should parse comments <!-- comment --> using a given tag', () => {
      const text =
        'text textec texte \n text <!--   bob: aaabbbbccc dddeeff    --> text \n text text';
      const tag = 'bob:';
      const parser = createTagInHtmlParser(tag);
      const range = parser.parse(text);
      expect(range).to.have.property('begin', '<!--');
      expect(range).to.have.property('end', '-->');
      expect(range).to.have.property('tag', 'bob:');
      expect(range).to.have.property('target', 'aaabbbbccc dddeeff');
      expect(range).to.have.property('first', 25);
      expect(range).to.have.property('last', 61);
    });

    it('should parse comments /* comment */ using a given tag', () => {
      let text =
        'text textec texte \n text /*   bob: aaabbbbccc dddeeff    */ text \n text text';
      let tag = 'bob:';
      let parser = createTagInHtmlParser(tag);
      let range = parser.parse(text);
      expect(range).to.have.property('begin', '/*');
      expect(range).to.have.property('end', '*/');
      expect(range).to.have.property('tag', 'bob:');
      expect(range).to.have.property('target', 'aaabbbbccc dddeeff');
      expect(range).to.have.property('first', 25);
      expect(range).to.have.property('last', 58);
    });

    it('should parse comments a pattern tag', () => {
      let text =
        'text textec texte \n text /*   bill: aaabbbbccc dddeeff    */ text \n text text';
      let tag = '(bob|bill):';
      let parser = createTagInHtmlParser(tag);
      let range = parser.parse(text);
      expect(range).to.have.property('begin', '/*');
      expect(range).to.have.property('end', '*/');
      expect(range).to.have.property('tag', 'bill:');
      expect(range).to.have.property('target', 'aaabbbbccc dddeeff');
      expect(range).to.have.property('first', 25);
      expect(range).to.have.property('last', 59);
    });

    it('should parse multiple comments', () => {
      let text =
        'text textec texte \n text /*   bill: aaabbbbccc dddeeff    */ text \n text text  <!-- bob: yo -->';
      let tag = '(bob|bill):';
      let parser = createTagInHtmlParser(tag);
      let range = parser.parse(text);
      expect(range).to.have.property('begin', '/*');
      expect(range).to.have.property('end', '*/');
      expect(range).to.have.property('tag', 'bill:');
      expect(range).to.have.property('target', 'aaabbbbccc dddeeff');
      expect(range).to.have.property('first', 25);
      expect(range).to.have.property('last', 59);
      range = parser.parse(text);
      expect(range).to.have.property('begin', '<!--');
      expect(range).to.have.property('end', '-->');
      expect(range).to.have.property('tag', 'bob:');
      expect(range).to.have.property('target', 'yo');
      expect(range).to.have.property('first', 79);
      expect(range).to.have.property('last', 94);
      range = parser.parse(text);
      expect(range).to.be.null;
    });
  });

  describe('#createErrorInHtmlParser', () => {
    it('should parse error with id', () => {
      let text =
        'texte xtex xtext \n <!-- Err: (45) Message erruer --> ,\n text text';
      let parser = createErrorInHtmlParser('Err:');
      let range = parser.parse(text);
      expect(range).to.have.property('sequence', 45);
    });
  });

  describe('#createResultInHtmlParser', () => {
    it('should parse result with int values', () => {
      let text = 'texte xtex xtext \n <!--Résultat:5/10--> ,\n text text';
      let parser = createResultInHtmlParser('Résultat:');
      let range = parser.parse(text);
      expect(range.result).to.have.property('numerator', 5);
      expect(range.result).to.have.property('denominator', 10);
    });

    it('should parse result with float values', () => {
      let text =
        'texte xtex xtext \n <!--Résultat:     5.4/10--> ,\n text text';
      let parser = createResultInHtmlParser('Résultat:');
      let range = parser.parse(text);
      expect(range.result).to.have.property('numerator', 5.4);
      expect(range.result).to.have.property('denominator', 10);
    });
  });
});
