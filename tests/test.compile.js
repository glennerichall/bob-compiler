const { expect } = require('chai');
const logger = require('../src/logger');

const { Comment, Compiler } = require('../src/compiler/compiler.js');
const fs = require('fs');
const { promisify } = require('util');

let readFile = promisify(fs.readFile);

// describe('Comment', () => {
//   describe('#constructor', () => {
//     it('should replace content in document', () => {
//       let text =
//         'texte xtex xtext \n <!-- Err:(45) Message erruer --> ,\n text text';
//       let parser = new ErrorParser();
//       let range = parser.parse(text);
//       let comment = new Comment(range, {});
//     });
//   });
// });

describe('Compiler', () => {
  const file = 'tests/FILJ76080201-sommatif-2-1.html';
  const db = 'tests/commentaires';

  describe('#load', () => {
    it('should load error comments', async () => {
      const compiler = new Compiler(file, db);
      await compiler.load();
      expect(compiler.comments).to.have.length(10);
    });

    it('should load database', async () => {
      const compiler = new Compiler(file, db);
      await compiler.load();
      expect(Object.keys(compiler.database.comments)).to.have.length(48);
    });

    it('should load result comment', async () => {
      const compiler = new Compiler(file, db);
      await compiler.load();
      expect(compiler.resultComment).to.be.instanceOf(Comment);
    });
  });

  describe('#execute', async () => {
    it('should call document.#save', async () => {
      const compiler = new Compiler(file, db);
      let saved = false;
      compiler.document.save = () => {
        saved = true;
      };
      await compiler.load();
      await compiler.execute();
      expect(saved).to.be.true;
    });

    it('should save document', async () => {
      const compiler = new Compiler(file, db);
      compiler.document.save = () => {
        // let content = compiler.document.content;
        // require('fs').writeFileSync('tests/saved.html', content, 'utf8');
      };
      await compiler.load();
      await compiler.execute();
      let content = await readFile('tests/saved.html', 'utf8');
      expect(compiler.document.content).to.be.equal(content);
    });

    it('should save document with no result', async () => {
      let file = 'tests/file-no-result.html';
      const compiler = new Compiler(file, db);
      compiler.document.save = () => {
        // let content = compiler.document.content;
        // require('fs').writeFileSync('tests/saved-no-result.html', content, 'utf8');
      };
      await compiler.load();
      await compiler.execute();
      let content = await readFile('tests/saved-no-result.html', 'utf8');
      expect(compiler.document.content).to.be.equal(content);
    });

    it('should warn missing keys', async () => {
      let file = 'tests/missing-key.html';
      const compiler = new Compiler(file, 'tests/missing-key-comments');
      let warn = logger.warn.bind(logger);
      let output = '';
      logger.warn = (msg) => (output += msg);
      compiler.document.save = () => {
        // let content = compiler.document.content;
        // require('fs').writeFileSync('tests/saved-no-result.html', content, 'utf8');
      };
      await compiler.load('Err:\\(\\d+\\)');
      await compiler.execute();
      logger.warn = warn;
      expect(output).to.equal(
        'Tag Err:(191) not found in tests/missing-key-comments at line 6 of tests/missing-key.html'
      );
    });
  });
});
