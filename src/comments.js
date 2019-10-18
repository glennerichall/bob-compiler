const fs = require('fs');
const util = require('util');
import { Parser, ErrorParser } from './parser.js';

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);

class CommentDbParser extends ErrorParser {
  constructor(tag) {
    super(tag);
    let pattern = '\\s*(?<points>\\d+(\\.\\d+){0,1})\\s*' + this.pattern.source;
    this.pattern = new RegExp(pattern, 'g');
  }

  parse(text) {
    let range = super.parse(text);
    if (!range) return range;
    range.points = Number.parseFloat(range.points);
    return range;
  }
}

export class CommentList {
  constructor(filename) {
    this.filename = filename;
    this.comments = [];
  }

  async load() {
    let content = await readFile(this.filename);
    let parser = new ErrorParser('Err:');

    let comment;
    while ((comment = parser.parse(content)) != null) {
      this.comments.push(comment);
    }
  }

  getComment(id) {}
}

/**
 * Fetch all comments from comments file found using <findCommentFile>
 * @param {*} file
 */
module.exports.getComments = async function getComments(file) {
  if (!(await exists(file)))
    return Promise.reject(`Le fichier ${file} n'existe pas`);

  let fileContent = await readFile(file, 'utf8');

  // read all lines of comments file using these formats:
  // 0.5 <!-- Err: (3) message -->
  // 0.5 /* Err: (3) message */
  let pattern = /(\d+(\.\d+){0,1})\s+((<!--|\/\*)\s*Err:\s*\((\d+)\).+)/g;
  let matches = pattern.exec(fileContent);
  if (!matches) {
    return Promise.reject(
      `Le fichier <${file}> est vide ou a un contenu non conforme`
    );
  }

  // find the total line using this format:
  // Total:20
  let pondMatches = /Total:\s*(\d+)/g.exec(fileContent);
  if (!pondMatches) {
    return Promise.reject(
      `Le fichier <${file}> doit avoir la pondération totale en entête: Total: n`
    );
  }

  // read all file and put into dictionnary where key is Err: (key)
  let comments = {};
  comments.total = Number.parseInt(pondMatches[1]);

  while (matches != null) {
    let id = matches[5];
    let comment = matches[3];
    let points = matches[1];
    comments[id] = {
      message: comment.trim(),
      points: Number.parseFloat(points.trim())
    };
    matches = pattern.exec(fileContent);
  }

  return Promise.resolve(comments);
};

module.exports.getInfo = function getInfo(comment, comments) {
  let { id, suffix } = comment;
  const { points, message } = comments[id];

  // replace comment endings (/* or -->) with actual points read from commets file
  const pattern = suffix.replace('/', '\\/').replace('*', '\\*');
  const regexp = new RegExp('\\s*' + pattern, 'g');
  const p = points <= 1 ? 'point' : 'points';
  const newEnd = `, (${points} ${p}) ${suffix}`;
  const msg = message.replace(regexp, newEnd);
  return {
    id,
    points,
    message: msg,
    ...comment
  };
};

module.exports.getDefaultFix = function getDefaultFix(lang) {
  let prefix, suffix;
  if (lang == '.js' || lang == '.css') {
    prefix = '/*';
    suffix = '*/';
  } else if (lang == '.html') {
    prefix = '<!--';
    suffix = '-->';
  }
  return {
    prefix,
    suffix
  };
};
