class EditorAction {
  constructor(range) {
    this.range = range;
  }

  compare(other) {
    if(other instanceof InsertRangeAction) return -other.compare(this);
    return this.range.first - other.range.first;
  }

  advance(editor) {
    editor.cursor = this.range.last + 1;
  }
}

class ReplaceRangeAction extends EditorAction {
  constructor(range, content) {
    super(range);
    this.content = content;
  }

  execute(editor) {
    this.advance(editor);
    return this.content;
  }

  
}

class DeleteRangeAction extends EditorAction {
  constructor(range) {
    super(range);
  }

  execute(editor) {
    this.advance(editor);
    return '';
  }
}

class InsertRangeAction extends EditorAction {
  constructor(range, content) {
    super(range);
    this.content = content;
  }

  execute(editor) {
    return this.content;
  }

  compare(other) {
    let diff = super.compare(other);
    if (diff == 0) {
      if (!(other instanceof InsertRangeAction)) {
        return -1;
      }
    }
    return diff;
  }
}

class NoopAction extends EditorAction {
  constructor(range) {
    super(range);
  }

  execute(editor) {
    this.advance(editor);
    return editor.document.content.substring(
      this.range.first,
      this.range.last + 1
    );
  }
}


module.exports = {
  EditorAction,
  ReplaceRangeAction,
  DeleteRangeAction,
  InsertRangeAction,
  NoopAction
};