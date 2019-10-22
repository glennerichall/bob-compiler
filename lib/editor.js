"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _actions = require("./actions.js");

var Editor =
/*#__PURE__*/
function () {
  function Editor(document) {
    (0, _classCallCheck2["default"])(this, Editor);
    this.document = document;
    this.commands = [];
    this.cursor = 0;
  }

  (0, _createClass2["default"])(Editor, [{
    key: "replaceRange",
    value: function replaceRange(range, content) {
      this.commands.push(new _actions.ReplaceRangeAction(range, content));
    }
  }, {
    key: "insertPosition",
    value: function insertPosition(position, content) {
      this.commands.push(new _actions.InsertRangeAction({
        first: position,
        last: position
      }, content));
    }
  }, {
    key: "prepare",
    value: function prepare() {
      var commands = this.commands;
      commands.sort(function (a, b) {
        return a.compare(b);
      }); // console.log(commands)

      var result = [];
      var cursor = 0;
      var i = 0;
      var n = this.document.content.length;

      do {
        var command = commands[i];
        var _command$range = command.range,
            first = _command$range.first,
            last = _command$range.last;

        if (i != 0) {
          var previous = commands[i - 1].range.last + 1;

          if (previous < first) {
            if (commands[i - 1] instanceof _actions.InsertRangeAction) {
              previous--;
            }

            var noop = new _actions.NoopAction({
              first: previous,
              last: first - 1
            });
            result.push(noop);
          }
        } else if (first != 0) {
          var _noop = new _actions.NoopAction({
            first: 0,
            last: first - 1
          });

          result.push(_noop);
        }

        result.push(command);
        cursor = command.range.last;
        i++;
      } while (i < commands.length);

      if (cursor < n) {
        var _noop2 = new _actions.NoopAction({
          first: cursor + 1,
          last: n - 1
        });

        result.push(_noop2);
      }

      return result;
    }
  }, {
    key: "done",
    value: function done() {
      var commands = this.prepare();
      var text = '';

      for (var i = 0; i < commands.length; i++) {
        text += commands[i].execute(this);
      }

      this.document.content = text;
    }
  }]);
  return Editor;
}();

exports.Editor = Editor;