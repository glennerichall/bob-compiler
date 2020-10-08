import {
  importPresets,
  listPresets,
  getPreset,
  removePreset,
} from '../src/cli/cli-presets.js';
import { expect } from 'chai';

describe('cli-presets', () => {
  describe('#importPresets', async () => {
    it('should import presets file correctly', async () => {
      await importPresets('./tests/testunits/bobc-presets.json');
      let preset = getPreset('dummy-preset');
      removePreset('dummy-preset');
      expect(preset).to.deep.equal({
        groupby: 'codepermanent',
        pattern:
          '(?<codepermanent>\\w{4}\\d{8})-(sommatif|formatif)-\\d{1,2}\\.(html|css|js)',
        parts: 'resolve',
      });
    });
  });
});
