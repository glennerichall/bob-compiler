#!/usr/bin/env node
//#!/usr/bin/env node --experimental-modules --no-warnings

const yargs = require('yargs');
const getVersion = require('./version.js');
const NpmApi = require('npm-api');
const logger = require('./logger.js');
const {levels} = require('./logger.js');
const parseYargs = require('./cli');

// ---------------------------------------------------------------------------
(async () => {
    try {
        const v = await getVersion();
        const argv = parseYargs(yargs).version(v).argv;

        if (argv.verbose) {
            logger.level = levels.info;
        }

        logger.info('\nCurrent effective options are:');
        logger.info(argv);
    } catch (e) {}

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

})();