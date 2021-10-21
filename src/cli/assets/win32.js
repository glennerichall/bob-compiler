module.exports.files = [
    {
        name: '(@{preset}) Windows Drop Over Me.bat',
        content: `@echo off
call bobc --version
if not exist  "commentaires-@{preset}.txt"  (
    echo Le fichier des commentaires par défaut n'existe pas et devrait être nommé ./commentaires-@{preset}.txt
)
call bobc compile "%~1" "commentaires-@{preset}.txt" --preset "@{preset}" --results csv > "result-@{preset}.txt"
chcp 65001 > nul
type "result-@{preset}.txt" | clip
type "result-@{preset}.txt"
pause`,
    },
//     {
//         name: '(Watch @{preset}) Windows Drop Over Me.bat',
//         content: `@echo off
// call bobc --version
// if not exist  "%~1\\commentaires" echo. >  "%~1\\commentaires"
// call bobc compile "%~1" "%~1\\commentaires" @{preset} --results csv --watch > "result-%~n1.txt"
// chcp 65001 > nul
// type "result-%~n1.txt" | clip
// type "result-%~n1.txt"`,
//     },
];
