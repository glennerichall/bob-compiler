#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings

const yargs = require('yargs/yargs');
const getVersion = require('./version.js');
const NpmApi = require('npm-api');
const logger = require('./logger.js');
const {levels} = require('./logger.js');
const parseYargs = require('./cli');
const { hideBin } = require('yargs/helpers');


// ---------------------------------------------------------------------------
const init = async (args, activeVersion) => {
    const v = activeVersion ?? await getVersion();
    if (process.env.trace === 'on') {
        logger.level = levels.trace;
    }
    try {
        const argv = parseYargs(yargs(hideBin(args))).version(v).argv;

        if (argv.verbose && logger.level > levels.info) {
            logger.level = levels.info;
        }

        logger.info('\nCurrent effective options are:');
        logger.info(argv);
    } catch (e) {
        logger.trace(e);
    }

    try {
        const npm = new NpmApi();
        const repo = npm.repo('bob-compiler');
        const {version} = await repo.package()
        if ('v' + version !== v) {
            console.warn(
                `Newer version available ${version}, consider upgrading it (npm upgrade -g bob-compiler)`
            );
        }
    } catch (e) {}

};


if (require.main === module) {
    init(process.argv);
} else {
    module.exports = init;
}