import { expect } from 'chai';
import { CommentList } from '../src/comments.js';
import fs from 'fs';
import { promisify } from 'util';

describe('CommentList', () => {
  describe('#load', () => {
    it('should load from file', async () => {
      let database = new CommentList('tests/commentaires');
      await database.load();
      expect(database.comments).to.have.length(47);
      expect(database.comments[1].id).to.equal(1);
      expect(database.comments[3].points).to.equal(0.5)
      expect(database.total.points).to.equal(60)
    });
  });
});
