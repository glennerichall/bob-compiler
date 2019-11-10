import { CompilationGroup } from '../src/group';

import { expect } from 'chai';
import { createResultParser } from '../src/parser.builder';

describe('CompilerGroup', () => {
  describe('#execute', () => {
    it('should execute and sum a group of files', async () => {
      let file1 = 'tests/file-no-result.html';
      let file2 = 'tests/FILJ76080201-sommatif-2-1.html';
      let db = 'tests/commentaires';
      let compiler = new CompilationGroup([file1, file2], db);
      
      compiler.compilers.forEach(compiler => {
        // disable saving
        compiler.document.save = () => {
            let parser = createResultParser('Résultat:');
            let content = compiler.document.content;
            let range = parser.parse(content);
            // console.log(content)
            // console.log(range);
            expect(range.result.numerator).to.equal(60-31);
        };
      });
      await compiler.load();
      await compiler.execute();
    });
  });
});
