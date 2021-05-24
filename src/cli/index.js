const {list, compile, presets, init, parse} = require('./verbs');


module.exports = yargs =>
    yargs
        .scriptName('bobc')
        .usage('$0 <cmd> [args]')
        .command(...list)
        .command(...presets)
        .command(...compile)
        .command(...init)
        .command(...parse)
        .wrap(yargs.terminalWidth())
        .demandCommand(1, '')
        .strict()
        .showHelpOnFail(true)
        .exitProcess(false)
        .help();