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
        this.nullpts = range.nullpts;
    }


    getPoints() {
        let points = super.getPoints();
        if (this.nullpts) {
            if(this.nullpts == "!") {
                points = 0;
            } else {
                points = points - Number.parseInt(this.nullpts.substring(1));
            }
        }
        return points;
    }

    getText() {
        let {id, begin, end, otherComment} = this.range;
        let {content} = this.database;
        let points = this.getPoints();
        let pond = super.getPoints();
        if (points !== super.getPoints()) points = `${points}/${pond}`;
        let card = Math.abs(pond) > 1 ? 's' : '';
        if (otherComment) {
            otherComment = '(' + otherComment + ') ';
        } else if (this.nullpts) {
            otherComment = 'Incorrect: ';
        } else if (pond < 0) {
            otherComment = 'Erreur: ';
        } else {
            otherComment = 'Ok: ';
        }
        let prefix = this.nullpts ?  this.nullpts : ' ';

        let template = `${begin} ${prefix}${id} ${otherComment}${content}, (${points} point${card}) ${
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
        let template = `${begin} ${tag} ${Math.max(sum, 0)}/${max} ${end}`;
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
        const {comments, numpoints} = this.database;
        const seen = {};

        let parser = createParser(this.database, tagPattern);
        let range;

        while ((range = parser.parse(content))) {
            let comment = comments[range.id];
            if (!seen[range.id]) seen[range.id] = 0;
            seen[range.id]++;
            this.comments.push(new TagComment(range, comment));
        }

        // FIXME The tag should be configurable by env var or presets...
        const tag = 'Résultat:';
        let fix = getDefaultFix(lang);
        let r = createResultParser(tag).parse(content) || {
            first: 0,
            last: 0,
            ...fix,
        };
        r = {
            ...r,
            max: numpoints,
            tag,
        };
        this.resultComment = new ResultComment(r);

        return seen;
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
            this.applyResult(editor, this.getTotal());
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