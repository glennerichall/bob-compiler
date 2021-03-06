const {promises} = require('fs');
const path = require('path');
const {float, standardValidChars} = require('./patterns.js');
const {stripCommentTags} = require('./parser.builder.js');
const readFile = promises.readFile;
const logger = require('../logger');

function loadFromCDbP(content, options = {}) {
    let comments = {};
    const lines = content
        .split('\n')
        .map((x, index) => ({content: x.trim(), line: index}))

        // ligne de commentaires dans le fichier de commentaires commencent avec #
        .filter(({content}) => !content.startsWith('#'))
        .filter(({content}) => content.length);

    if (lines.length === 0) {
        logger.error(`Le fichier commentaires est vide`);
        throw new Error(`Le fichier commentaires est vide`);
    }

    const tagPattern = options.tagPattern ?? standardValidChars;
    const pattern = new RegExp(
        `(?<points>${float})\\s+(?<id>${tagPattern})\\s+(?<content>\\S+.+)`
    );
    for (let i = 1; i < lines.length; i++) {
        const {content, line} = lines[i];
        let comment = content;
        try {
            const range = pattern.exec(comment)?.groups;
            if (range) {
                range.points = Number.parseFloat(range.points);
                comments[range.id] = range;
            } else {
                throw new Error(`Aucun pattern trouvé pour le tag ${pattern} dans le fichier de commentaires`)
            }
        } catch (e) {
            logger.warn(`Le commentaire: " ${content} " à la ligne ${line} est invalide dans le fichier de commentaires`);
            logger.trace(e);
        }
    }

    let total = lines[0].content.replace('Total:', '').trim();
    let numpoints;
    try {
        if (total.toLowerCase() === 'auto') {
            total = 0;
            for (let id in comments) {
                const {points} = comments[id];
                if (points > 0) {
                    total += points;
                }
            }
            if (total <= 0) {
                throw new Error();
            }
            numpoints = total;
            total = 0;
        } else {
            total = Number.parseInt(total);
            numpoints = total;
        }
    } catch (e) {
        logger.error('Le total doit être inscrit à la première ligne du fichier de commentaires et \n' +
            "un total auto doit contenir des commentaires à valeur positives");
        throw e;
    }
    return {comments, total, numpoints};
}

function loadFromJson(content) {
    let {total, comments} = JSON.parse(content);

    for (let key in comments) {
        comments[key].id = key;
    }
    return {
        comments,
        total,
    };
}

function determineType(filename, content) {
    if (path.extname(filename) === '.json') {
        return 'json';
    }

    return 'comments';
}

async function loadComments(filename, options) {
    let content = await readFile(filename, 'utf-8');
    let type = determineType(filename, content);
    if (type === 'json') {
        return loadFromJson(content);
    }

    if (type === 'comments') {
        return loadFromCDbP(content, options);
    }

    return null;
}

function asDatabase(database) {
    return database instanceof CommentList ? database : new CommentList(database);
}

class CommentList {
    constructor(filename) {
        this.filename = filename;
        this.comments = null;
    }

    async load(tagPattern) {
        let {comments, total, numpoints} = await loadComments(this.filename, {tagPattern});
        this.comments = comments;
        this.total = total;
        this.numpoints = numpoints;
    }
}

function getDefaultFix(lang) {
    let begin, end;
    if (
        lang === 'js' ||
        lang === 'css' ||
        lang === 'cs' ||
        lang === 'cpp' ||
        lang === 'c' ||
        lang === 'c++' ||
        lang === 'java' ||
        lang === 'gradle'
    ) {
        begin = '/*';
        end = '*/';
    } else if (
        lang === 'html' ||
        lang === 'xaml' ||
        lang === 'xml'
    ) {
        begin = '<!--';
        end = '-->';
    }
    return {
        begin,
        end,
    };
}


module.exports = {
    determineType,
    asDatabase,
    CommentList,
    getDefaultFix
};