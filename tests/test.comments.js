const {expect} = require('chai');
const {CommentList, determineType} = require('../src/compiler/comments.js');
const {promises} = require('fs');

describe('CommentList', () => {
    describe('#load', () => {

        it('should permit a-zA-Z.-_\d from tag sequence', async () => {
            let database = new CommentList('tests/commentaires');
            await database.load();
            expect(database.comments).to.have.property('Err:(Q1.1)');
            expect(database.comments).to.have.property('Err:(Q_1-1.2)');
        });

        it('should load from file with comments', async () => {
            let database = new CommentList('tests/commentaires');
            await database.load();
            expect(Object.keys(database.comments)).to.have.length(48);
            expect(database.comments["Err:(Q1.1)"]).to.have.property('id', "Err:(Q1.1)");
            expect(database.comments["Err:(3)"]).to.have.property('points', -0.5);
            expect(database.total).to.equal(60);
            expect(database.comments["Err:(45)"]).to.have.property('content', "Rien n'a été fait");
        });

        it('should load from file', async () => {
            let database = new CommentList('tests/commentaires.txt');
            await database.load();
            expect(Object.keys(database.comments)).to.have.length(24);
            expect(database.comments['Err:(1)']).to.have.property('id', "Err:(1)");
            expect(database.comments['Err:(3)']).to.have.property('points', -0.5);
            expect(database).to.have.property('total', 30);
        });

        it('should load from json file', async () => {
            let database = new CommentList('tests/commentaires.json');
            await database.load();
            expect(Object.keys(database.comments)).to.have.length(2);
            expect(database.comments["Err:(1)"]).to.have.property('id',"Err:(1)");
            expect(database.comments["Err:(2)"]).to.have.property('points', -0.5);
            expect(database.comments["Err:(2)"]).to.have.property('content',
                'Tous les éléments de hautes importances dans les paragraphes, y compris les 3ième bacon'
            );
            expect(database.total).to.equal(60);
        });

        it('should load assertions and errors', async()=>{
            let database = new CommentList('tests/correction-positive.txt');
            await database.load();
            expect(Object.keys(database.comments)).to.have.length(7);
        });

        it('should calculate auto Total', async()=>{
            let database = new CommentList('tests/correction-positive.txt');
            await database.load();
            expect(database).to.have.property('total', 0);
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
