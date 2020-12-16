const {asDatabase, getDefaultFix} = require('./comments.js');
const {Document} = require('../editor/document.js');
const memoized = require('../utils/memoized');
const logger = require('../logger');

const {
    createParser,
    createResultParser
} = require('./parser.builder.js');

const {
    combined
} = require('./tags');

const {EOL} = require('os');

class Comment {
    constructor(range, database) {
        this.range = range;
        this.database = database;
    }

    update(editor, content) {
        if (this.range.first === this.range.last) {
            editor.insertPosition(this.range.first, this.getText(content) + EOL);
        } else {
            editor.replaceRange(this.range, this.getText(content));
        }
    }

    getPoints() {
        let {points} = this.database;
        return points;
    }

    isValid() {
        return !!this.database;
    }

    getText() {}
}

class TagComment extends Comment {
    constructor(range, database) {
        super(range, database);
    }

    getText() {
        let {id, begin, end} = this.range;
        let {points, content} = this.database;
        let card = Math.abs(points) > 1 ? 's' : '';
        let template = `${begin} ${id} ${content}, (${points} point${card}) ${
            end || ''
        }`;
        return template;
    }
}

class ResultComment extends Comment {
    constructor(range, database) {
        super(range, database);
    }

    getText(sum) {
        let {tag, begin, end, max} = this.range;
        let template = `${begin} ${tag} ${Math.max(max + sum, 0)}/${max} ${end}`;
        return template;
    }
}

class Compiler {
    constructor(filename, database) {
        this.document = new Document(filename);
        this.database = asDatabase(database);
        this.comments = [];
    }

    async load(tagPattern) {
        await this.document.load();
        await this.database.load(tagPattern);
        let {content, lang} = this.document;
        const {comments, total} = this.database;

        let parser = createParser(this.database, tagPattern);
        let range;
        while ((range = parser.parse(content))) {
            this.comments.push(new TagComment(range, comments[range.id]));
        }
        // FIXME Should be configurable by env var or presets...
        const tag = 'Résultat:';
        let fix = getDefaultFix(lang);
        let r = createResultParser(tag).parse(content) || {
            first: 0,
            last: 0,
            ...fix,
        };
        r = {
            ...r,
            max: total,
            tag,
        };
        this.resultComment = new ResultComment(r);
    }

    getSum = memoized(() => {
        let sum = 0;
        for (let comment of this.comments) {
            if (comment.isValid()) {
                sum += comment.getPoints();
            }
        }
        return sum;
    });

    applyComments(editor) {
        for (let comment of this.comments) {
            if (!comment.isValid()) {
                let {range: {id}} = comment;
                const line = this.document.content
                    .substring(0, comment.range.first)
                    .split('\n').length;
                logger.warn(
                    `Tag ${id} not found in ${this.database.filename} at line ${line} of ${this.document.filename}`
                );
                continue;
            }
            comment.update(editor);
        }
    }

    applyResult(editor, sum) {
        this.resultComment.update(editor, sum);
    }

    getTotal() {
        return Math.max(this.database.total + this.getSum(), 0);
    }

    async execute() {
        await this.document.edit(editor => {
            this.applyComments(editor);
            this.applyResult(editor, this.getSum());
            return true;
        });
        await this.document.save();
        return this.getTotal();
    }
}


module.exports = {
    Comment,
    ErrorComment: TagComment,
    ResultComment,
    Compiler
};