const {Compiler} = require('../compiler/compiler.js');
const {CompilationGroup} = require('../compiler/group.js');
const {promises} = require('fs');
const readdir = require('recursive-readdir');
const path = require('path');
const logger = require('../logger.js');

const {access, lstat, F_OK} = promises;

const getGroups = async (source, options) => {
    options = options || {
        pattern: '.*',
        parts: 'resolve',
    };
    const pattern = new RegExp(options.pattern, 'i');
    const exclude = options.exclude ? new RegExp(options.exclude, 'i') : null;
    let files;

    try {
        files = await readdir(source);
        logger.info(`${files.length} fichier(s) trouvé(s)`);
        logger.info(`Filtrage des fichiers selon [pattern] et [exclude] : `);
        logger.info(`pattern: ${pattern}`);
        logger.info(`exclude: ${exclude}`);
    } catch (e) {
        console.trace(e);
        throw e;
    }

    files = files.filter((file) => pattern.test(path[options.parts](file)));
    logger.debug(`${files.length} fichier(s) correspondant(s) selon [pattern]`);
    if (exclude) {
        let n = files.length;
        files = files.filter((file) => !exclude.test(path[options.parts](file)));
        logger.debug(`${n - files.length} fichier(s) exclus(s) selon [exclude]`);
    }

    logger.info(`${files.length} fichier(s) conservé(s)`);

    if (!!options.groupby) {
        let names = options.groupby;
        if (!Array.isArray(names)) names = [names];

        let groups = files.reduce((result, current) => {
            let match = pattern.exec(path[options.parts](current));
            if (match) {
                let key = names.reduce((result, key) => {
                    result += match.groups[key];
                    return result;
                }, '');
                if (!result[key]) {
                    result[key] = [];
                }
                result[key].push(current);
            }
            return result;
        }, {});

        return groups;
    }

    return files;
};

// ---------------------------------------------------------------------------
const compileGroup = async (source, commentaires, options) => {
    let groups = await getGroups(source, options);

    groups = Object.keys(groups).map((key) => {
        let files = groups[key];
        let group = new CompilationGroup(files, commentaires);
        group.key = key;
        if (options.dryrun) group.dryrun();
        return group;
    });

    logger.info(`${groups.length} groupe(s) de fichier(s)`);

    let results = {};
    for (let group of groups) {
        let files = group.files;
        logger.info(`Compilation du groupe de fichier(s) : ${group.key}`);
        for (let file of files) {
            logger.info(file.replace(path.join(source, '\\'), '\t'));
        }
        logger.info('\n');

        let seen = await group.load(options.tagPattern);

        let warnCount = 0;
        for (let id in group.database.comments) {
            let {points} = group.database.comments[id];
            if (!seen[id] && points > 0) {
                warnCount++;
                if (warnCount <= 2) {
                    logger.warn(
                        `Tag ${id} was in ${path.basename(group.database.filename)} but has not been seen for ${group.key}`
                    );
                }
            } else if (seen[id] > 1) {
                warnCount++;
                if (warnCount <= 2) {
                    logger.warn(
                        `Tag ${id} has been seen ${seen[id]} times for ${group.key}`
                    );
                }
            }
        }
        if (warnCount > 2) {
            logger.warn(`... and ${warnCount} other warnings`);
        }

        let result = await group.execute();
        results[group.key] = result;

        if (options.print) {
            await group.export();
        }
    }
    return results;
};

// ---------------------------------------------------------------------------
const compileOne = async (source, commentaires, options) => {
    let compiler = new Compiler(source, commentaires);
    if (options.dryrun) {
        compiler.document.saveAs = async () => Promise.resolve(true);
    }
    let seen = await compiler.load(options.tagPattern);

    for (let id in compiler.database.comments) {
        let {points} = compiler.database.comments[id].range;
        if (!seen[id] && points > 0) {
            logger.warn(
                `Tag ${id} was in ${path.basename(compiler.database.filename)} but has not been seen in ${source}`
            );
        } else if (seen[id] > 1) {
            logger.warn(
                `Tag ${id} has been seen ${seen[id]} times in ${source}`
            );
        }
    }

    let res = await compiler.execute();
    if (options.print) {
        await compiler.document.export();
    }
    return res;
};

// ---------------------------------------------------------------------------
const compile = async (source, commentaires, options) => {
    try {
        await access(source, F_OK);
    } catch (e) {
        logger.error(`Le chemin source ${source} n'existe pas`);
        return;
    }
    try {
        await access(commentaires, F_OK);
    } catch (e) {
        logger.error(`Le chemin commentaires ${commentaires} n'existe pas`);
        return;
    }
    let start = new Date();
    try {
        const stats = await lstat(source);
        if (stats.isDirectory() && !options.single) {
            logger.info('Compilation par groupes de fichiers');
            let results = await compileGroup(source, commentaires, options);
            if (options.results === 'csv') {
                for (let key in results) {
                    console.log(`${key} : ${results[key]}`);
                }
            } else if (options.results === 'json') {
                console.log(JSON.stringify(results));
            }
        } else {
            let result = await compileOne(source, commentaires, options);
        }
    } catch (e) {
        logger.trace(e);
        throw e;
    }
    logger.info(
        `\nCompilation terminée en ${new Date() - start} milliseconde(s)`
    );
};


module.exports = {
    getGroups,
    compileGroup,
    compileOne,
    compile
};