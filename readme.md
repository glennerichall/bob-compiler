# bob-compiler
[![NPM version](https://img.shields.io/npm/v/bob-compiler)](https://www.npmjs.com/package/bob-compiler) [![NPM monthly downloads](https://img.shields.io/npm/dm/bob-compiler.svg)](https://npmjs.org/package/bob-compiler) [![NPM total downloads](https://img.shields.io/npm/dt/bob-compiler.svg)](https://npmjs.org/package/bob-compiler) [![Linux Build Status](https://img.shields.io/travis/glennerichall/bob-compiler.svg)](https://travis-ci.org/glennerichall/bob-compiler)

> Command line application to compile annotated code files in comments.


## Install globaly
Install with [npm](https://www.npmjs.com/):

```sh
$ npm install -g bob-compiler
```

## Usage

```sh
$ bobc compile <file|dir­> <comments> [--groupby] [--pattern] [--parts] [--single] [--preset] [--results] [--print]
```

Compiles *file* or files in *dir*, replacing tags in every files with text in *comments*.

## Examples
Here is an example of *comments* file content Iit may be in that format or in JSON format):
```properties
Total:60
1   Err:(4)The URL has the wrong value
1   Err:(9) Pseudo-element has wrong background-color
1   Err:(10) All text must be justified
0.5 Err:(11) File is badly named
1   Err:(19) Missing information
```

And a file annotated with tags
```html
<!-- Err:(11) -->
<!DOCTYPE html>
<html lang="fr">

<head>
    <!-- Err:(19) -->
    <meta charset="UTF-8" />
    <meta name="author" content="" />

    <style>
        html {
            border-left: solid;
            margin-left: 50px;
            border-width: 10px;
            /* Err:(25) */
            padding: 10px;
            text-align: justify;
        }
    </style>
</head>

<body>
    <!-- Err:(22) -->
    <p class="pizzabacon">
        Chop. pork enim et occaecat shankle eiusmod landjaeger nisi
        <i>cillum</i> Id tail. magna cow non consectetur sunt jerky, qui chop Pork
        consectetur. ad lorem chicken <i>beef</i> corned quis.
    </p>
</body>

</html>
```

So, in a HTML file for instance, add comments containing the error tags `<!-- Err: (n) -->` where errors are encountered.

`bobc` will replace all comments with in *comments* file and sum-up all the points lost in the file adding a comment 
## Commands

### compile

```sh
compile <file|dir­> <comments> [--groupby] [--pattern] [--parts] [--single] [--preset] [--results]
```

Compile *file* or files in *dir* using *comments* as replacement text for tags in file(s).

#### pattern

optional. Regular expression for filtering files in *dir*.

#### parts

optional. Parts of file to use in *pattern*. 
* resolve (alias fullname), default
* extname
* basename

#### groupby

optional. Parameter indicating that a named group in *pattern* is to be used to group files from *dir* into a single summation unit.

#### presets

##### Example
```sh
--pattern "(?<usercode>\w{4}\d{4|6}).*\.(html|cs))" --groupby usercode
```

#### results
optional. Print results summed for every group defined by *groupby*
* csv
* json

#### preset
optional. Use a preset for optional paramters defined with *presets* command.

#### print
optional. Export all compiled files to pdf.

```sh
presets <action> [name] [--groupby] [--pattern] [--parts] [--single] [--preset] [--results]
```

Define presets to use later in *compile* command.
Actions may be:
* add
* remove
* list
* clear
* share