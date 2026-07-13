export const defineEditorThemes = (monaco) => {
  monaco.editor.defineTheme('codeforge-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },
      { token: 'class', foreground: '50fa7b' },
      { token: 'function', foreground: '50fa7b', fontStyle: 'bold' },
      { token: 'preprocessor', foreground: 'ffb86c' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#161b22',
      'editorCursor.foreground': '#f8f8f0',
      'editor.selectionBackground': '#44475a',
      'editor.inactiveSelectionBackground': '#3c3d4a',
      'editorLineNumber.foreground': '#8b949e',
      'editorLineNumber.activeForeground': '#58a6ff',
      'editorWidget.background': '#161b22',
      'editorWidget.border': '#30363d',
    }
  });

  monaco.editor.defineTheme('codeforge-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8c959f', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'cf222e', fontStyle: 'bold' },
      { token: 'string', foreground: '0a3069' },
      { token: 'number', foreground: '0550ae' },
      { token: 'type', foreground: '953800', fontStyle: 'italic' },
      { token: 'class', foreground: '116329' },
      { token: 'function', foreground: '8250df', fontStyle: 'bold' },
      { token: 'preprocessor', foreground: 'cf222e' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292f',
      'editor.lineHighlightBackground': '#f6f8fa',
      'editorCursor.foreground': '#0969da',
      'editor.selectionBackground': '#add6ff',
      'editor.inactiveSelectionBackground': '#eaeef2',
      'editorLineNumber.foreground': '#8c959f',
      'editorLineNumber.activeForeground': '#0969da',
      'editorWidget.background': '#ffffff',
      'editorWidget.border': '#d0d7de',
    }
  });
};
