const {writeFile, chmod} = require('fs').promises;
const {constants} = require('fs');
const path = require('path')

const postProcess = (name)=>{
  return chmod(name,
      constants.S_IXUSR |
      constants.S_IRUSR |
      constants.S_IWUSR);
};

// TODO ca devrait provenir de paramètres en cli
//  --geometry=160x30
// et
//  --full-screen
// gnome-terminal --geometry=160x30 --full-screen
module.exports.files = [
  {
    name: '(@{preset}) Linux Drop Over Me.desktop',
    content: `[Desktop Entry]
Encoding=UTF-8
Name=Drop Over Me
Comment=Execute the script with the file dropped
Exec=gnome-terminal --geometry=160x30 -- "@{curdir}/.compile-@{preset}.sh"
Icon=utilities-terminal
Type=Application
Terminal=true
Name[en_CA]=(Compile @{preset}) Linux Drop Over Me`,
  },
  {
    name: '.compile-@{preset}.sh',
    content: `#!/bin/bash
source ~/.bashrc
bobc --version
bobc compile "$1" "$1/../commentaires-@{preset}.txt" --preset "@{preset}" --results csv > "$1/../result-@{preset}.txt"
cat "$1/../result-@{preset}.txt" | xclip
cat "$1/../result-@{preset}.txt"
read -n1 -r -p "Press any key to continue..." key`,
    postProcess
  },


//   {
//     name: '(Watch) Linux Drop Over Me.desktop',
//     content: `[Desktop Entry]
// Encoding=UTF-8
// Name=Drop Over Me
// Comment=Execute the script with the file dropped
// Exec=gnome-terminal -- "@{curdir}/.watch.sh"
// Icon=utilities-terminal
// Type=Application
// Terminal=true
// Name[en_CA]=(Compile) Linux Drop Over Me`,
//   },
//   {
//     name: '.watch.sh',
//     content: `#!/bin/bash
// source ~/.bashrc
// bobc --version
// if [ ! -f "$1/commentaires" ]; then touch "$1/commentaires"; fi
// bobc compile "$1" "$1/commentaires" @{preset} --results csv --watch > "$1/../result-\${1##*/}.txt"
// cat "$1/../result-\${1##*/}.txt" | xclip
// cat "$1/../result-\${1##*/}.txt"`,
//   },


];
