const positiveInt = '\\d+';
const positiveFloat = '\\d+(?:\\.\\d+)?';
const float = `-?${positiveFloat}`;
const int = `-?${positiveInt}`;
const ratio = `((?:${positiveFloat})/(?:${positiveInt}))`;
const standardValidChars = '[a-zA-Z\\d\\.\\-_\\(\\):]+';

const commentBlock = '(\\/\\*)([\\s\\S]*?)(\\*\\/)';
const commentLine = '(\\/\\/)(.*)($)';
const commentXml = '(<!--)([\\s\\S]*?)(-->)';
const commentSharp = `(^#)(.*)($)`;

const comment =
  '(' + [commentBlock, commentLine, commentXml, commentSharp].join('|') + ')';

module.exports = {
  positiveInt,
  positiveFloat,
  float,
  int,
  ratio,
  commentBlock,
  commentLine,
  commentXml,
  commentSharp,
  comment,
  standardValidChars
};