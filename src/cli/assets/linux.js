module.exports.files = [
  {
    name: '(Compile) Linux Drop Over Me.desktop',
    content: `[Desktop Entry]
Encoding=UTF-8
Name=Drop Over Me
Comment=Execute the script with the file dropped
Exec=gnome-terminal -- "@{curdir}/.compile.sh"
Icon=utilities-terminal
Type=Application
Terminal=true
Name[en_CA]=(Compile) Linux Drop Over Me`,
  },
  {
    name: '.compile.sh',
    content: `#!/bin/bash
source ~/.bashrc
bobc --version
if [ ! -f "$1/commentaires" ]; then touch "$1/commentaires"; fi
bobc compile "$1" "$1/commentaires" @{preset} --results csv > "$1/../result-\${1##*/}.txt"
cat "$1/../result-\${1##*/}.txt" | xclip
cat "$1/../result-\${1##*/}.txt"
read -n1 -r -p "Press any key to continue..." key`,
  },
  {
    name: '(Watch) Linux Drop Over Me.desktop',
    content: `[Desktop Entry]
Encoding=UTF-8
Name=Drop Over Me
Comment=Execute the script with the file dropped
Exec=gnome-terminal -- "@{curdir}/.watch.sh"
Icon=utilities-terminal
Type=Application
Terminal=true
Name[en_CA]=(Compile) Linux Drop Over Me`,
  },
  {
    name: '.watch.sh',
    content: `#!/bin/bash
source ~/.bashrc
bobc --version
if [ ! -f "$1/commentaires" ]; then touch "$1/commentaires"; fi
bobc compile "$1" "$1/commentaires" @{preset} --results csv --watch > "$1/../result-\${1##*/}.txt"
cat "$1/../result-\${1##*/}.txt" | xclip
cat "$1/../result-\${1##*/}.txt"`,
  },
];
