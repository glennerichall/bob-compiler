const patterns = require('../src/compiler/patterns.js');
const { expect } = require('chai');

describe('patterns', () => {
  describe('comments', () => {
    it('should capture /*  */', () => {
      let res = new RegExp(patterns.commentBlock, 'gm').exec(
        'blahhh blah /* comment \n/*inline */  blah /* fgd */  jb'
      );
      expect(res).to.not.be.null;
      expect(res[2]).to.deep.equal(' comment \n/*inline ');
    });

    it('should capture comment line', () => {
      let res = new RegExp(patterns.commentLine, 'gm').exec(
        'blahhh blah // comment \n/*inline */ blah'
      );
      expect(res).to.not.be.null;
      expect(res[2]).to.deep.equal(' comment ');
    });

    it('should capture comment <!-- -->', () => {
      let res = new RegExp(patterns.commentXml, 'gm').exec(
        'blahhh blah <!-- comment <!--\ninline --> blah'
      );
      expect(res).to.not.be.null;
      expect(res[2]).to.deep.equal(' comment <!--\ninline ');
    });

    it('should capture any comment', () => {
      let txt =
        'blahhh blah <!-- comment <!--\ninline --> blah\nblahhh blah // comment \nf vf/*inline */ blah';
      let p = new RegExp(patterns.comment, 'gm');

      let r = (e) =>
        e
          .slice(2)
          .filter((_, i) => i % 3 == 1)
          .reduce((a, b) => a || b);
      expect(r(p.exec(txt))).to.deep.equal(' comment <!--\ninline ');
      expect(r(p.exec(txt))).to.deep.equal(' comment ');
      expect(r(p.exec(txt))).to.deep.equal('inline ');
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

});
