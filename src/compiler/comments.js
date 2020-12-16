const {promises} = require('fs');
const path = require('path');
const {float, standardValidChars} = require('./patterns.js');
const {stripCommentTags} = require('./parser.builder.js');
const readFile = promises.readFile;
const logger = require('../logger');

function loadFromCDbP(content, options) {
    options = options || {};
    let comments = {};
    const lines = content
        .split('\n')
        .map((x, index) => ({content: x.trim(), line: index}))

        // ligne de commentaires dans le fichier de commentaires commencent avec #
        .filter(({content}) => !content.startsWith('#'))
        .filter(({content}) => content.length);

    const pattern = new RegExp(
        `(?<points>${float})\\s+(?<id>${standardValidChars})\\s+(?<content>\\S+.+)`
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
            total = 0;
        } else {
            total = Number.parseInt(total);
        }
    } catch (e) {
        logger.error('Le total doit être inscrit à la première ligne du fichier de commentaires et \n' +
            "un total auto doit contenir des commentaires à valeur positives");
        throw e;
    }
    return {comments, total};
}

function loadFromJson(content) {
    let {total, comments} = JSON.parse(content);

    for (let key in comments) {
        comments[key].id  = key;
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
    constructor(filename, options) {
        this.filename = filename;
        this.comments = null;
        this.options = options;
    }

    async load() {
        let {comments, total} = await loadComments(this.filename, this.options);
        this.comments = comments;
        this.total = total;
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
        lang === 'java'
    ) {
        begin = '/*';
        end = '*/';
    } else if (lang === 'html' || lang === 'xaml') {
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