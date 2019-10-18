import { expect } from 'chai';
import { Editor } from '../src/editor.js';

describe('Editor', () => {
  describe('#prepare', () => {
    it('should sort actions', () => {
      let editor = new Editor({ text: '01234567890abcdef' });
      let a = { first: 10, last: 20 };
      let b = { first: 30, last: 40 };
      let c = { first: 60, last: 80 };
      editor.replaceRange(b);
      editor.replaceRange(a);
      editor.replaceRange(c);
      let actions = editor.prepare();
      for (let i = 1; i < actions.length; i++) {
        expect(actions[i - 1].compare(actions[i])).to.be.below(0);
      }
    });

    it('should pad with noop actions', () => {
      let editor = new Editor({ text: '01234567890abcdefghijklmnop' });
      // noop here (0,2)
      let a = { first: 3, last: 5 };
      // noop here (6,7)
      let b = { first: 8, last: 9 };
      let c = { first: 10, last: 12 };
      // noop here (13, last)
      editor.replaceRange(b, 'qqqq');
      editor.replaceRange(a, 'wwww');
      editor.replaceRange(c, 'eeee');
      let actions = editor.prepare();

      expect(actions).to.have.length(6);

      expect(actions[0].range.first).to.equal(0);
      expect(actions[0].range.last).to.equal(2);

      expect(actions[2].range.first).to.equal(6);
      expect(actions[2].range.last).to.equal(7);

      expect(actions[5].range.first).to.equal(13);
      expect(actions[5].range.last).to.equal(26);
    });

    it('should pad with noop actions', () => {
      let editor = new Editor({ text: '01234567890abcdefghijklmnop' });
      // noop here (0,2)
      let a = { first: 3, last: 5 };
      // noop here (6,7)
      let b = { first: 8, last: 9 };
      let c = { first: 10, last: 12 };
      // noop here (13, last)
      editor.replaceRange(b, 'qqqq');
      editor.replaceRange(a, 'wwww');
      editor.replaceRange(c, 'eeee');
      let actions = editor.prepare();

      expect(actions[0].execute(editor)).to.equal('012');
      expect(actions[1].execute(editor)).to.equal('wwww');
      expect(actions[2].execute(editor)).to.equal('67');
      expect(actions[3].execute(editor)).to.equal('qqqq');
      expect(actions[4].execute(editor)).to.equal('eeee');
      expect(actions[5].execute(editor)).to.equal('cdefghijklmnop');
    });
  });

  describe('#done', () => {
    it('should apply actions', () => {
      let doc = { text: '01234567890abcdefghijklmnop' };
      let editor = new Editor(doc);
      let a = { first: 3, last: 5 };
      let b = { first: 8, last: 9 };
      let c = { first: 10, last: 12 };
      editor.replaceRange(b, 'qqqq');
      editor.replaceRange(a, 'wwww');
      editor.replaceRange(c, 'eeee');
      editor.done();
      expect(doc.text).to.equal('012wwww67qqqqeeeecdefghijklmnop');
    });
  });
});
