import { expect } from 'chai';
import { CommentList } from '../src/comments.js';
import fs from 'fs';
import { promisify } from 'util';

describe('CommentList', () => {
  describe('#load', () => {
    it('should load from file', async () => {
      let comments = new CommentList('tests/commentaires');
      await comments.load();
    });
  });
});
