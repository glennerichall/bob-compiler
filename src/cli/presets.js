const settings = require('settings-store');
const { promises } = require('fs');
const readFile = promises.readFile;

settings.init({
  appName: 'bob-compiler', //required,
  publisherName: 'Glenn Hall', //optional
  reverseDNS: 'com.velor.bob-compiler', //required for macOS
  enableReloading: false,
});

function clean(value) {
  delete value['$0'];
  delete value['_'];
  delete value['preset'];
  delete value['action'];

  for (let key in value) {
    if (value[key] === undefined) {
      delete value[key];
    }
  }
  return value;
}

function putPreset(name, args) {
  let value = {
    ...args,
  };
  clean(value);
  settings.setValue(name, value);
}

function mergePreset(name, args) {
  let preset = getPreset(name);
  args = clean({ ...args });
  preset = {
    ...preset,
    ...args,
  };
  putPreset(name, preset);
}

function applyPresets(presets) {
  return presets.reduce((result, preset) => {
    let p = settings.value(preset, {});
    return {
      ...result,
      ...p,
    };
  }, {});
}

function listPresets() {
  return settings.all();
}

function getPreset(name) {
  return settings.value(name);
}

function clearPresets() {
  return settings.clear();
}

function renamePreset(old, name) {
  const preset = settings.value(old);
  settings.delete(old);
  settings.setValue(name, preset);
}

function removePreset(preset) {
  return settings.delete(preset);
}

async function importPresets(file) {
  let content = await readFile(file);

  // replace single backslash \ with double backslash \\ to unescape it
  content = content.toString().replace(/\\/g, '\\\\');
  const presets = JSON.parse(content);
  for (let preset in presets) {
    settings.setValue(preset, presets[preset]);
  }
}


module.exports = {
  putPreset,
  mergePreset,
  applyPresets,
  listPresets,
  getPreset,
  clearPresets,
  renamePreset,
  removePreset,
  importPresets
};