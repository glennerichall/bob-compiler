const readdir = require('recursive-readdir');
const logger = require('../logger.js');
const {
    createParser
} = require('../compiler/parser.builder.js');
const path = require('path');
const sep = '/\\\\';

const {Document} = require('../editor/document');

async function load(filename, tagPattern) {
    let document = new Document(filename);
    await document.load();
    let {content} = document;
    const comments = [];
    let parser = createParser(null, tagPattern);
    let range;
    while ((range = parser.parse(content))) {
        comments.push(range);
        try {
            range.points = Number.parseFloat(range.content.trim().split(/\s/)[0]);
        } catch (e) {
            logger.error(`Error at file ${filename}`);
        }
    }
    return comments;
}

module.exports.parse = async function parse(source, tagPattern) {
    let files;

    let pattern = "(" + [
        "java",
        "cs",
        "sql",
        "xaml",
        "html",
        "css",
        "js",
        "xml",
        "gradle"
    ].map(x => `\.${x}$`)
        .join('|') + ")";

    let exclude = [
        'bin',
        'obj',
        '.idea',
        '.gradle',
        'build',
        'node_modules'
    ];

    exclude = "(" + exclude.map(x => `[${sep}]${x}[${sep}]`).join('|') + ")";

    try {
        files = await readdir(source);
        logger.info(`${files.length} fichier(s) trouvé(s)`);

        logger.info(`Filtrage des fichiers selon [pattern] et [exclude] : `);
        logger.info(`pattern: ${pattern}`);
        logger.info(`exclude: ${exclude}`);

        pattern = new RegExp(pattern);
        exclude = new RegExp(exclude);
        files = files.filter((file) => pattern.test(path.resolve(file)));

        logger.debug(`${files.length} fichier(s) correspondant(s) selon [pattern]`);
        let n = files.length;
        files = files.filter((file) => !exclude.test(path.resolve(file)));
        logger.debug(`${n - files.length} fichier(s) exclus(s) selon [exclude]`);

        for (let i = 0; i < Math.min(files.length, 5); i++) {
            logger.debug(files[i]);
        }
        if (files.length > 5) {
            logger.debug(`et ${files.length - 5} autres fichiers ...`);
        }

    } catch (e) {
        console.trace(e);
        throw e;
    }

    let result = {};
    let filenames = {};

    for (let file of files) {
        let comments = await load(file, tagPattern);

        if (comments.length && !filenames[file]) {
            filenames[file] = [];
        }

        for (let comment of comments) {
            // #96:
            // On a capturé la pondération dans le nom du tag. On retire cette pondération du id du commentaire.
            // voir verbs\parse.js #70
            comment.id = comment.id.split(/\s+/)[1];
            if (result[comment.id]) {
                logger.warn(`Tag ${comment.id} has been declared twice or more times`);
            }
            result[comment.id] = {
                points: comment.points,
                description: comment.content
                    .replace(comment.points, '')
                    .replace(comment.id, '')
                    .trim()
            };
            filenames[file].push(comment.id);
        }
    }

    return {result, filenames};
}