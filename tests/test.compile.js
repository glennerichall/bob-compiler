import { expect } from 'chai';
import {
  Comment,
  EditorAction,
  ReplaceRangeAction,
  NoopAction,
  Editor
} from '../src/compiler.js';

describe('EditorAction', () => {
  describe('#compare', () => {
    it('should compare two actions range', () => {
      let action1 = new EditorAction({
        first: 1,
        last: 10
      });
      let action2 = new EditorAction({
        first: 13,
        last: 30
      });
      let diff = action1.compare(action2);
      expect(diff).to.be.below(0);
    });
  });
  describe('#advance', () => {
    it('should advance editor cursor', () => {
      let action = new EditorAction({
        first: 4,
        last: 10
      });
      let editor = {
        cursor: 4
      };
      action.advance(editor);
      expect(editor.cursor).to.equal(11);
    });
  });
});

describe('ReplaceRangeAction', () => {
  describe('#execute', () => {
    it('should return content to replace', () => {
      let action = new ReplaceRangeAction(
        {
          first: 1,
          last: 10
        },
        ' a ne say'
      );
      let text = action.execute({ cursor: 1 });
      expect(text).to.equal(' a ne say');
    });
  });
});

describe('NoopAction', () => {
  describe('#execute', () => {
    it('should return document text', () => {
      let action = new NoopAction({
        first: 3,
        last: 10
      });
      let text = action.execute({
        cursor: 3,
        document: { text: '01234567890abcdef' }
      });
      expect(text).to.equal('34567890');
    });
  });
});

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

  describe('#done', ()=>{
    it('should apply actions', ()=>{
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

// describe('Comment', () => {
//   describe('#constructor', () => {
//     it('should replace content in document', () => {
//       let text =
//         'texte xtex xtext \n <!-- Err: (45) Message erruer --> ,\n text text';
//       let parser = new ErrorParser();
//       let range = parser.parse(text);
//       let comment = new Comment(range, {});
//     });
//   });
// });
