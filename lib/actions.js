"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoopAction = exports.InsertRangeAction = exports.DeleteRangeAction = exports.ReplaceRangeAction = exports.EditorAction = void 0;

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var EditorAction =
/*#__PURE__*/
function () {
  function EditorAction(range) {
    (0, _classCallCheck2["default"])(this, EditorAction);
    this.range = range;
  }

  (0, _createClass2["default"])(EditorAction, [{
    key: "compare",
    value: function compare(other) {
      if (other instanceof InsertRangeAction) return -other.compare(this);
      return this.range.first - other.range.first;
    }
  }, {
    key: "advance",
    value: function advance(editor) {
      editor.cursor = this.range.last + 1;
    }
  }]);
  return EditorAction;
}();

exports.EditorAction = EditorAction;

var ReplaceRangeAction =
/*#__PURE__*/
function (_EditorAction) {
  (0, _inherits2["default"])(ReplaceRangeAction, _EditorAction);

  function ReplaceRangeAction(range, content) {
    var _this;

    (0, _classCallCheck2["default"])(this, ReplaceRangeAction);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ReplaceRangeAction).call(this, range));
    _this.content = content;
    return _this;
  }

  (0, _createClass2["default"])(ReplaceRangeAction, [{
    key: "execute",
    value: function execute(editor) {
      this.advance(editor);
      return this.content;
    }
  }]);
  return ReplaceRangeAction;
}(EditorAction);

exports.ReplaceRangeAction = ReplaceRangeAction;

var DeleteRangeAction =
/*#__PURE__*/
function (_EditorAction2) {
  (0, _inherits2["default"])(DeleteRangeAction, _EditorAction2);

  function DeleteRangeAction(range) {
    (0, _classCallCheck2["default"])(this, DeleteRangeAction);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DeleteRangeAction).call(this, range));
  }

  (0, _createClass2["default"])(DeleteRangeAction, [{
    key: "execute",
    value: function execute(editor) {
      this.advance(editor);
      return '';
    }
  }]);
  return DeleteRangeAction;
}(EditorAction);

exports.DeleteRangeAction = DeleteRangeAction;

var InsertRangeAction =
/*#__PURE__*/
function (_EditorAction3) {
  (0, _inherits2["default"])(InsertRangeAction, _EditorAction3);

  function InsertRangeAction(range, content) {
    var _this2;

    (0, _classCallCheck2["default"])(this, InsertRangeAction);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(InsertRangeAction).call(this, range));
    _this2.content = content;
    return _this2;
  }

  (0, _createClass2["default"])(InsertRangeAction, [{
    key: "execute",
    value: function execute(editor) {
      return this.content;
    }
  }, {
    key: "compare",
    value: function compare(other) {
      var diff = (0, _get2["default"])((0, _getPrototypeOf2["default"])(InsertRangeAction.prototype), "compare", this).call(this, other);

      if (diff == 0) {
        if (!(other instanceof InsertRangeAction)) {
          return -1;
        }
      }

      return diff;
    }
  }]);
  return InsertRangeAction;
}(EditorAction);

exports.InsertRangeAction = InsertRangeAction;

var NoopAction =
/*#__PURE__*/
function (_EditorAction4) {
  (0, _inherits2["default"])(NoopAction, _EditorAction4);

  function NoopAction(range) {
    (0, _classCallCheck2["default"])(this, NoopAction);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(NoopAction).call(this, range));
  }

  (0, _createClass2["default"])(NoopAction, [{
    key: "execute",
    value: function execute(editor) {
      this.advance(editor);
      return editor.document.content.substring(this.range.first, this.range.last + 1);
    }
  }]);
  return NoopAction;
}(EditorAction);

exports.NoopAction = NoopAction;