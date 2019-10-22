"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var _actions = require("./actions.js");

class Editor {
  constructor(document) {
    this.document = document;
    this.commands = [];
    this.cursor = 0;
  }

  replaceRange(range, content) {
    this.commands.push(new _actions.ReplaceRangeAction(range, content));
  }

  insertPosition(position, content) {
    this.commands.push(new _actions.InsertRangeAction({
      first: position,
      last: position
    }, content));
  }

  prepare() {
    let {
      commands
    } = this;
    commands.sort((a, b) => a.compare(b)); // console.log(commands)

    let result = [];
    let cursor = 0;
    let i = 0;
    let n = this.document.content.length;

    do {
      let command = commands[i];
      let {
        first,
        last
      } = command.range;

      if (i != 0) {
        let previous = commands[i - 1].range.last + 1;

        if (previous < first) {
          if (commands[i - 1] instanceof _actions.InsertRangeAction) {
            previous--;
          }

          let noop = new _actions.NoopAction({
            first: previous,
            last: first - 1
          });
          result.push(noop);
        }
      } else if (first != 0) {
        let noop = new _actions.NoopAction({
          first: 0,
          last: first - 1
        });
        result.push(noop);
      }

      result.push(command);
      cursor = command.range.last;
      i++;
    } while (i < commands.length);

    if (cursor < n) {
      let noop = new _actions.NoopAction({
        first: cursor + 1,
        last: n - 1
      });
      result.push(noop);
    }

    return result;
  }

  done() {
    let commands = this.prepare();
    let text = '';

    for (let i = 0; i < commands.length; i++) {
      text += commands[i].execute(this);
    }

    this.document.content = text;
  }

}

exports.Editor = Editor;