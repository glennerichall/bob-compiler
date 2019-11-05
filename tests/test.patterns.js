import * as patterns from '../src/patterns.js';
import { expect } from 'chai';

describe('patterns', () => {
  describe('commentsJs', () => {
    it('should capture /* any content */', () => {
      let res = new RegExp(patterns.commentJsCaptureAll).exec(
        'blahhh blah /* comment inline */ blah'
      );
      expect(res).to.not.be.null;
      expect(res.groups).to.deep.equal({
        begin: '/*',
        content: ' comment inline ',
        end: '*/'
      });
    });
  });

  describe('float', () => {
    it('should capture negative float', () => {
      let res = new RegExp(patterns.float).exec('blah -1.45 blah');
      expect(res).to.not.be.null;
      expect(res[0]).to.equal('-1.45');
    });

    it('should capture positive float', () => {
      let res = new RegExp(patterns.float).exec('blah 1.45 blah');
      expect(res).to.not.be.null;
      expect(res[0]).to.equal('1.45');
    });

    it('should capture positive integer', () => {
      let res = new RegExp(patterns.float).exec('blah 145 blah');
      expect(res).to.not.be.null;
      expect(res[0]).to.equal('145');
    });

    it('should capture negative integer', () => {
      let res = new RegExp(patterns.float).exec('blah -145 blah');
      expect(res).to.not.be.null;
      expect(res[0]).to.equal('-145');
    });
  });

  describe('errorTag', () => {
    it('should capture sequence Err(i):', () => {
      let res = new RegExp(patterns.errorTag('Err', ':')).exec(
        'blah Err    ( 11)        : blah blah blah'
      );
      expect(res).to.not.be.null;
      expect(res.groups.sequence).to.equal('11');
      expect(res.groups.target).to.equal(' blah blah blah');
      expect(res.groups.error).to.equal('Err');
    });

    it('should capture sequence Err(i)', () => {
        let res = new RegExp(patterns.errorTag('Err')).exec(
          'blah Err    (11 )  blah blah blah'
        );
        expect(res).to.not.be.null;
        expect(res.groups.sequence).to.equal('11');
        expect(res.groups.target).to.equal('blah blah blah');
        expect(res.groups.error).to.equal('Err');
      });
  });

  describe('errorTagInHtml', ()=>{
    it('should capture sequence /*    Wrn(i): blah bvlag */', () => {
        let res = new RegExp(patterns.errorTagInHtml('Wrn',':')).exec(
          'blah /*      Wrn    ( 11 )  : blah blah blah    */'
        );
        expect(res).to.not.be.null;
        expect(res.groups.sequence).to.equal('11');
        expect(res.groups.target).to.equal(' blah blah blah    ');
        expect(res.groups.error).to.equal('Wrn');
      });
  })
});
