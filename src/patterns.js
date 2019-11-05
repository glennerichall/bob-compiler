export const commentsJs = {
  begin: '\\/\\*',
  end: '\\*\\/'
};

export const commentsXml = {
  begin: '<!--',
  end: '-->'
};

export const commentsHtml = {
  begin: `${commentsJs.begin}|${commentsXml.begin}`,
  end: `${commentsJs.end}|${commentsXml.end}`
};

export const positiveInt = '\\d+';
export const positiveFloat = '\\d+(\\.\\d+){0,1}';
export const float = `-{0,1}${positiveFloat}`;
export const int = `-{0,1}${positiveInt}`;
export const ratio = `((${positiveFloat})/(${positiveInt}))`;

export const blockCapture = (begin, end, content) =>
  `(?<begin>${begin})(?<content>\\s*${content||'.*'}\\s*)(?<end>${end})`;

export const commentHtmlCapture = content =>
  blockCapture(commentsHtml.begin, commentsHtml.end, content);

export const commentJsCapture = content =>
  blockCapture(commentsJs.begin, commentsJs.end, content);

export const commentHtmlCaptureAll = commentHtmlCapture('.*');

export const commentJsCaptureAll = commentJsCapture('.*');

export const tagCapture = (tag, content) =>
  `(?<tag>${tag})(?<target>${content || '.*'})`;

export const tagSequence = (tagBegin, tagEnd, content) =>
  tagCapture(
    `${tagBegin}\\s*(?<sequence>${positiveInt})\\s*${tagEnd}`,
    content
  );

export const errorTag = (tag, sep, content) =>
  tagSequence(
    `(?<error>${tag})\\s*\\(`,
    `\\)\\s*${sep || ''}`,
    content || '.*'
  );

export const errorTagInBlock = (tag, sep, begin, end, content) =>
  blockCapture(begin, end, errorTag(tag, sep, content));

export const errorTagInHtml = (tag, sep, content) =>
  commentHtmlCapture(errorTag(tag, sep, content));

export const tagInHtml = (tag, sep, content) =>
  commentHtmlCapture(tagCapture(tag, content));
