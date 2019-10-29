import { getGroups } from '../src/cli-compile.js';
import { expect } from 'chai';

describe('cli-compile', () => {
  describe('#getGroups', () => {
    it('should get group all files in a single group by default', async () => {
      let files = await getGroups('./tests/folders');
      expect(files).to.have.length(10);
    });

    it('should filter using regexp pattern', async () => {
      let files = await getGroups('./tests/folders', {
        pattern: '.*.toto',
        parts: 'resolve'
      });
      expect(files).to.have.length(4);
    });

    it('should group by regexp pattern', async () => {
      let files = await getGroups('./tests/folders', {
        pattern: '(?<name>.*).(toto|bob)',
        parts: 'basename',
        groupby: 'name'
      });
      expect(files).to.have.keys(['a', 'b', 'c']);
      expect(files.a).to.have.length(4);
      expect(files.b).to.have.length(4);
      expect(files.c).to.have.length(2);
    });
  });
});
