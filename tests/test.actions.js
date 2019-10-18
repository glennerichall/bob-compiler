import { expect } from 'chai';
import {
  EditorAction,
  ReplaceRangeAction,
  NoopAction
} from '../src/actions.js';

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
        document: { content: '01234567890abcdef' }
      });
      expect(text).to.equal('34567890');
    });
  });
});
