import { expect } from 'chai';
import {
  listPresets,
  putPreset,
  setId,
  clearPresets
} from '../src/cli/cli-remote.js';

const binId = '1cmq6c';

describe('cli-remote', () => {
  before(async () => {
    setId(binId);
  });

  beforeEach(async () => {
    await clearPresets();
    const name = 'initial';
    const preset = {
      pattern: '5555555555',
      groupby: 'bla5656h'
    };
    await putPreset(name, preset);
  });

  describe('#listPresets', () => {
    it('should get presets', async () => {
      let result = await listPresets();
      expect(result).not.to.be.null;
    });
  });

  describe('#clearPresets', () => {
    it('should clear presets', async () => {
      await clearPresets();
      let result = await listPresets();
      expect(result).not.to.be.null;
      expect(result).to.deep.equal({});
    });
  });

  describe('#putPreset', () => {
    it('should put preset', async () => {
      const name = 'sdfgdfgdgdgfvsdzx2345345635c';
      const preset = {
        pattern: 'sdfsdfsdf',
        groupby: 'blah'
      };
      await putPreset(name, preset);

      let presets = await listPresets();
      expect(presets[name]).to.deep.equal(preset);
    });

    it('should put and keep preset', async () => {
      let original = await listPresets();

      const name = 'rtrtrtrt';
      const preset = {
        pattern: 'sdfsdfsdf',
        groupby: 'blah'
      };
      await putPreset(name, preset);

      let presets = await listPresets();
      expect(presets[name]).to.deep.equal(preset);

      for (let name in original) {
        expect(presets[name]).to.deep.equal(original[name]);
      }
    });
  });
});
