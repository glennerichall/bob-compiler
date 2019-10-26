"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPreset = setPreset;
exports.applyPresets = applyPresets;
exports.listPresets = listPresets;
exports.clearPresets = clearPresets;

var _settingsStore = _interopRequireDefault(require("settings-store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_settingsStore.default.init({
  appName: 'bob-compiler',
  //required,
  publisherName: 'Glenn Hall',
  //optional
  reverseDNS: 'com.velor.bob-compiler',
  //required for macOS
  enableReloading: false
});

function setPreset(args, options) {
  let value = { ...args
  };
  delete value['$0'];
  delete value['_'];
  delete value['preset'];
  delete value['action'];
  if (options.verbose) console.log(`Setting preset ${args.preset}`);

  _settingsStore.default.setValue(args.preset, value);
}

function applyPresets(presets) {
  return presets.reduce((result, preset) => {
    let p = _settingsStore.default.value(preset, {});

    return { ...result,
      ...p
    };
  }, {});
  return {};
}

function listPresets() {
  return _settingsStore.default.all();
}

function clearPresets() {
  return _settingsStore.default.clear();
}