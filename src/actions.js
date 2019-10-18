export class EditorAction {
  constructor(range) {
    this.range = range;
  }

  compare(other) {
    return this.range.first - other.range.first;
  }

  advance(editor) {
    editor.cursor = this.range.last + 1;
  }
}

export class ReplaceRangeAction extends EditorAction {
  constructor(range, content) {
    super(range);
    this.content = content;
  }

  execute(editor) {
    this.advance(editor);
    return this.content;
  }
}

export class DeleteRangeAction extends EditorAction {
  constructor(range) {
    super(range);
  }

  execute(editor) {
    this.advance(editor);
    return '';
  }
}

export class InsertRangeAction extends EditorAction {
  constructor(range, content) {
    super(range);
    this.content = content;
  }

  execute(editor) {
    return this.content;
  }
}

export class NoopAction extends EditorAction {
  constructor(range) {
    super(range);
  }

  execute(editor) {
    this.advance(editor);
    return editor.document.text.substring(
      this.range.first,
      this.range.last + 1
    );
  }
}
