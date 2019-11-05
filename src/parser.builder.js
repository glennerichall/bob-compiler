import {
  tagCapture,
  tagInHtml,
  tagSequence,
  errorTagInHtml,
  ratio,
  commentHtmlCapture
} from './patterns.js';
import Parser from './parser.js';

export function createTagParser(tag) {
  const pattern = new RegExp(tagCapture(tag, '.*'));
  return new Parser(pattern);
}

export function createTagInHtmlParser(tag) {
  const pattern = new RegExp(tagInHtml(tag, '.*'), 'g');
  return new Parser(pattern, {
    transformers: {
      target: content => content.trim()
    }
  });
}

export function createErrorInHtmlParser(tag) {
  const pattern = new RegExp(errorTagInHtml(tag), 'g');
  return new Parser(pattern, {
    transformers: {
      target: content => content.trim(),
      tag: content => content.trim(),
      sequence: seq => Number.parseInt(seq)
    },
    postprocessors: [
      range => {
        range.id = range.sequence;
        return range;
      }
    ]
  });
}

export function createResultInHtmlParser(tag) {
  let content = `${tag}\\s*(?<result>${ratio})`;
  const pattern = new RegExp(commentHtmlCapture(content), 'g');
  return new Parser(pattern, {
    transformers: {
      content: content => content.trim(),
      result: r => {
        let tokens = r.split('/');
        let numerator = Number.parseFloat(tokens[0]);
        let denominator = Number.parseFloat(tokens[1]);
        return {
          numerator,
          denominator
        };
      }
    }
  });
}

const inner = new RegExp(commentHtmlCapture());
export function stripCommentTags(text) {
  let matches = inner.exec(text);
  if (!!matches) {
    return text.replace(matches[0], matches.groups.content.trim());
  }
  return text;
}
