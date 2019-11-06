import settings from 'settings-store';
import { promises } from 'fs';
const readFile = promises.readFile;

settings.init({
  appName: 'bob-compiler', //required,
  publisherName: 'Glenn Hall', //optional
  reverseDNS: 'com.velor.bob-compiler', //required for macOS
  enableReloading: false
});

export function setPreset(args, options) {
  let value = {
    ...args
  };
  delete value['$0'];
  delete value['_'];
  delete value['preset'];
  delete value['action'];
  if (options.verbose) console.log(`Setting preset ${args.preset}`);
  settings.setValue(args.preset, value);
}

export function applyPresets(presets) {
  return presets.reduce((result, preset) => {
    let p = settings.value(preset, {});
    return {
      ...result,
      ...p
    };
  }, {});
  return {};
}

export function listPresets() {
  return settings.all();
}

export function clearPresets() {
  return settings.clear();
}

export function removePreset(preset) {
  settings.delete(preset);
}

export async function importPresets(file) {
  const content = await readFileSync(file);
  const presets = JSON.parse(content);
  for (let preset in presets) {
    settings.setValue(preset, presets[preset]);
  }
}
