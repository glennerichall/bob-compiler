module.exports.files = [
    {
        name: '(@{preset}) Windows Drop Over Me.bat',
        content: `@echo off
call bobc --version
if not exist  "commentaires-@{preset}.txt"  (
    echo "Total: auto" >  "commentaires-@{preset}.txt"
    echo "# Les informations dans les colonnes suivantes:" >>  "commentaires-@{preset}.txt"
    echo "# Pondération  |   Code   |    Commentaires" >>  "commentaires-@{preset}.txt"
    echo "# La pondération est numérique et peut être négative" >>  "commentaires-@{preset}.txt"
    echo "# Le code ne doit pas contenir d'espaces" >>  commentaires-@{preset}.txt"
    echo "# Exemple:" >>  commentaires-@{preset}.txt"
    echo "1     Q1      Commentaire pour la question 1" >>  "commentaires-@{preset}.txt"
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
