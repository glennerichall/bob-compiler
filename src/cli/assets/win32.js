module.exports.files = [
    {
        name: '(Compile) Windows Drop Over Me.bat',
        content: `@echo off
call bobc --version
if not exist  "%~1\\commentaires"  (
    echo "Total: auto" >  "%~1\\commentaires"
    echo "# Pondération Code Commentaires" >>  "%~1\\commentaires"
    echo "# La pondération est numérique et peut être négative" >>  "%~1\\commentaires"
    echo "# Le code ne doit pas contenir d'espaces" >>  "%~1\\commentaires"
    echo "# Exemple:" >>  "%~1\\commentaires"
    echo "1     Q1      Commentaire pour la question 1" >>  "%~1\\commentaires"
)
call bobc compile "%~1" "%~1\\commentaires" @{preset} --results csv > "result-%~n1.txt"
chcp 65001 > nul
type "result-%~n1.txt" | clip
type "result-%~n1.txt"
pause`,
    },
    {
        name: '(Watch) Windows Drop Over Me.bat',
        content: `@echo off
call bobc --version
if not exist  "%~1\\commentaires" echo. >  "%~1\\commentaires"
call bobc compile "%~1" "%~1\\commentaires" @{preset} --results csv --watch > "result-%~n1.txt"
chcp 65001 > nul
type "result-%~n1.txt" | clip
type "result-%~n1.txt"`,
    },
];
