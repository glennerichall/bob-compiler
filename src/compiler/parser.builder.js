const {standardValidChars, ratio, comment} = require('./patterns.js');
const Parser = require('./parser.js');

const chain = (a, b) => {
    return {
        parse(txt) {
            let res;
            let range;
            do {
                res = a.parse(txt);
                if (!res) return null;
                range = b.parse(res.content);
            } while (range == null);
            return {
                ...range,
                ...res,
            };
        },
    };
};

// function createTagParser(tag) {
//     const pattern = new RegExp(tagCapture(tag, '.*'), 'm');
//     let parser = new Parser(pattern, {
//         transformers: {
//             target: (content) => content.trim(),
//         },
//     });
//     return chain(createCommentParser(), parser, 'content', ['target', 'tag']);
// }

function createParser(database) {
    const ids = Object.keys(database.comments).join('|')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
    const pattern = new RegExp(`(?<id>${ids}).*`, 'm');
    const parser = new Parser(pattern);
    return chain(createCommentParser(), parser);
}

function createResultParser(tag) {
    let content = `${tag}\\s*(?<result>${ratio})`;
    const pattern = new RegExp(content, 'm');
    let parser = new Parser(pattern, {
        transformers: {
            content: content => content.trim(),
            result: result => {
                let [numerator, denominator] = result.split('/');
                numerator = Number.parseFloat(numerator);
                denominator = Number.parseFloat(denominator);
                return {
                    numerator,
                    denominator,
                };
            },
        },
    });

    return chain(createCommentParser(), parser);
}

function createCommentParser(local) {
    let pattern = new RegExp(comment, !local ? 'gm' : 'm');
    return new Parser(pattern, {
        postprocessors: [
            range => {
                let o = range.matches.slice(2).filter((x) => x);
                range.begin = o[0];
                range.content = o[1];
                range.end = o[2];
                return range;
            },
        ],
    });
}

// const inner = createCommentParser(true);

// function stripCommentTags(text) {
//     const range = inner.parse(text);
//     if (!!range) {
//         let content = range.content.trim();
//         return text.replace(range.matches[0], content);
//     }
//     return text;
// }

module.exports = {
    // createTagParser,
    createParser,
    createResultParser,
    createCommentParser,
    // stripCommentTags
};
