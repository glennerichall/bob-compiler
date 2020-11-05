const { expect } = require('chai');
const { CommentList, determineType } = require('../src/comments.js');
const { promises } = require('fs');

describe('CommentList', () => {
  describe('#load', () => {
    it('should load from file with comments', async () => {
      let database = new CommentList('tests/commentaires');
      await database.load();
      expect(database.comments).to.have.length(47);
      expect(database.comments[1].id).to.equal(1);
      expect(database.comments[3].points).to.equal(0.5);
      expect(database.total).to.equal(60);
      expect(database.comments[45].target).to.equal("Rien n'a été fait");
    });

    it('should load from file', async () => {
      let database = new CommentList('tests/commentaires.txt');
      await database.load();
      expect(database.comments).to.have.length(25);
      expect(database.comments[1].id).to.equal(1);
      expect(database.comments[3].points).to.equal(0.5);
      expect(database.total).to.equal(30);
    });

    it('should load from json file', async () => {
      let database = new CommentList('tests/commentaires.json');
      await database.load();
      expect(database.comments).to.have.length(3);
      expect(database.comments[1].id).to.equal(1);
      expect(database.comments[2].points).to.equal(0.5);
      expect(database.comments[2].content).to.equal(
        'Tous les éléments de hautes importances dans les paragraphes, y compris les 3ième bacon'
      );
      expect(database.total).to.equal(60);
    });
  });

  describe('#determineType', () => {
    it('should find json', async () => {
      const filename = 'tests/commentaires.json';
      let content = await promises.readFile(filename);
      let type = determineType(filename, content);
      expect(type).to.equal('json');
    });
  });
});
