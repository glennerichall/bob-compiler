const positiveInt = '\\d+';
const positiveFloat = '\\d+(\\.\\d+){0,1}';
const float = `-{0,1}${positiveFloat}`;
const int = `-{0,1}${positiveInt}`;
const ratio = `((${positiveFloat})/(${positiveInt}))`;

const tagCapture = (tag, content) =>
  `(?<tag>${tag})(?<target>${content || '.*'})`;

const tagSequence = (tagBegin, tagEnd, content) =>
  tagCapture(
    `${tagBegin}\\s*(?<sequence>${positiveInt})\\s*${tagEnd}`,
    content
  );

const errorTag = (tag, sep, content) =>
  tagSequence(
    `(?<error>${tag})\\s*\\(`,
    `\\)\\s*${sep || ''}`,
    content || '.*'
  );

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
  tagCapture,
  tagSequence,
  errorTag,
  commentBlock,
  commentLine,
  commentXml,
  commentSharp,
  comment
};