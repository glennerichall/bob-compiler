
const {list, compile, presets, init} = require('./verbs');

module.exports = yargs =>
    yargs
    .scriptName('bobc')
    .usage('$0 <cmd> [args]')
    .command(...list)
    .command(...presets)
    .command(...compile)
    .command(...init)
    .wrap(yargs.terminalWidth())
    .demandCommand(1, '')
    .strict()
    .showHelpOnFail(true)
    .exitProcess(false)
    .help();