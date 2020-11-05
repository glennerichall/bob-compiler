const { promises } = require('fs');
const path = require('path');
const { errorTag, positiveFloat } = require('./patterns.js');
const { stripCommentTags } = require('./parser.builder.js');

const readFile = promises.readFile;

function loadFromCDbP(content, options) {
  options = options || {};
  let comments = [];
  content = content
    .split('\n')
    .map((x) => x.trim())
    .filter((x) => !x.startsWith('#'))
    .filter((x) => x.length);

  const pattern = new RegExp(
    `(?<points>${positiveFloat})\\s+${errorTag('Err:{0,1}', ':{0,1}')}`
  );
  for (let i = 1; i < content.length; i++) {
    let comment = stripCommentTags(content[i]);
    const range = pattern.exec(comment).groups;
    range.id = Number.parseInt(range.sequence);
    range.points = Number.parseFloat(range.points);
    comments[range.id] = range;
  }

  let total = content[0].replace('Total:', '');
  total = Number.parseInt(total);
  return { comments, total };
}

function loadFromJson(content) {
  let { total, messages } = JSON.parse(content);
  let comments = [];
  let pattern = new RegExp(errorTag('Err:'));

  for (let key of Object.keys(messages)) {
    let id = pattern.exec(key.trim()).groups.sequence;
    id = Number.parseInt(id);
    comments[id] = messages[key];
    comments[id].id = id;
  }
  return {
    comments,
    total,
  };
}

function determineType(filename, content) {
  if (path.extname(filename) == '.json') {
    return 'json';
  }

  return 'comments';
}

async function loadComments(filename, options) {
  let content = await readFile(filename, 'utf-8');
  let type = determineType(filename, content);
  if (type == 'json') {
    return loadFromJson(content);
  }

  if (type == 'comments') {
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
    let { comments, total } = await loadComments(this.filename, this.options);
    this.comments = comments;
    this.total = total;
  }
}

function getDefaultFix(lang) {
  let begin, end;
  if (
    lang == 'js' ||
    lang == 'css' ||
    lang == 'cs' ||
    lang == 'cpp' ||
    lang == 'c' ||
    lang == 'c++' ||
    lang == 'java'
  ) {
    begin = '/*';
    end = '*/';
  } else if (lang == 'html' || lang == 'xaml') {
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