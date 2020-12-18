const {expect} = require('chai');
const {CommentList, determineType} = require('../src/compiler/comments.js');
const {promises} = require('fs');
const logger = require('../src/logger');

describe('CommentList', () => {
    describe('#load', () => {

        it('should permit a-zA-Z.-_\d()[]: from tag id', async () => {
            let database = new CommentList('tests/commentaires');
            await database.load();
            expect(database.comments).to.have.property('Err:(Q1.1)[]');
            expect(database.comments).to.have.property('Err:(Q_1-1.2)[]');
        });

        it('should permit custom tag id', async () => {
            let database = new CommentList('tests/commentaires');
            await database.load('Err:\\(\\d+\\)');
            expect(Object.keys(database.comments)).to.have.length(46);
        });

        it('should warn for bad comment declaration', async () => {
            let database = new CommentList('tests/commentaires');
            let warn = logger.warn.bind(logger);
            let output = '';
            logger.warn = (msg) => (output += msg);
            await database.load('Err:\\(\\d+\\)');
            logger.warn = warn;
            expect(output).to.equal(
                'Le commentaire: " -0.5\tErr:(Q1.1)[] Top bidon " à la ligne 47 est invalide dans ' +
                'le fichier de commentairesLe commentaire: " -0.5\tErr:(Q_1-1.2)[] Top top bidon " à la ligne ' +
                '48 est invalide dans le fichier de commentaires'
            );
        });

        it('should load from file with comments', async () => {
            let database = new CommentList('tests/commentaires');
            await database.load();
            expect(Object.keys(database.comments)).to.have.length(48);
            expect(database.comments["Err:(Q1.1)[]"]).to.have.property('id', "Err:(Q1.1)[]");
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
