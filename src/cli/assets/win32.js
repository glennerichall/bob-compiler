module.exports.files = [
    {
        name: '(Compile) Windows Drop Over Me.bat',
        content: `@echo off
call bobc --version
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
call bobc compile "%~1" "%~1\\commentaires" @{preset} --results csv --watch > "result-%~n1.txt"
chcp 65001 > nul
type "result-%~n1.txt" | clip
type "result-%~n1.txt"`,
    },
];
