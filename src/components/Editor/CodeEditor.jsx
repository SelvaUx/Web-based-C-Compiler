import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useFileStore } from '../../stores/fileStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useCompilerStore } from '../../stores/compilerStore';
import { defineEditorThemes } from '../../config/editorThemes';
import { registerCLanguageCompletions } from '../../config/cLanguage';

const CodeEditor = () => {
  const activeFileId = useFileStore((state) => state.activeFileId);
  const files = useFileStore((state) => state.files);
  const updateFileContent = useFileStore((state) => state.updateFileContent);
  const saveFile = useFileStore((state) => state.saveFile);

  const fontSize = useSettingsStore((state) => state.fontSize);
  const tabSize = useSettingsStore((state) => state.tabSize);
  const editorTheme = useSettingsStore((state) => state.editorTheme);
  const wordWrap = useSettingsStore((state) => state.wordWrap);
  const minimap = useSettingsStore((state) => state.minimap);
  const autoSave = useSettingsStore((state) => state.autoSave);

  const errors = useCompilerStore((state) => state.errors);

  const activeFile = files.find(f => f.id === activeFileId);
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  // Handle Monaco Initialization
  const handleEditorBeforeMount = (monaco) => {
    defineEditorThemes(monaco);
    registerCLanguageCompletions(monaco);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Sync content updates
  const handleEditorChange = (value) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
      
      // Auto-save implementation
      if (autoSave) {
        // debounce save to avoid writing to IndexedDB continuously on every keystroke
        const timer = setTimeout(() => {
          saveFile(activeFileId);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  };

  // Add error decorations in Monaco editor
  useEffect(() => {
    if (!editorRef.current || !activeFile) return;

    const editor = editorRef.current;
    const monaco = window.monaco || (editor.getModel() ? editor.getModel()._manager : null);
    
    if (!monaco) return;

    // Filter errors that happen in the active file
    // Since we compile single-file or primary files, map the parsed errors directly
    const newDecorations = errors.map((err) => ({
      range: new monaco.Range(err.line, 1, err.line, 100),
      options: {
        isWholeLine: true,
        className: err.type === 'warning' ? 'warningDecoration' : 'errorDecoration',
        glyphMarginClassName: err.type === 'warning' ? 'warningGlyphMargin' : 'errorGlyphMargin',
        hoverMessage: { value: `${err.type.toUpperCase()}: ${err.message}` },
      },
    }));

    // Update decorations on editor
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [errors, activeFileId]);

  // Insert styles for decorations dynamically
  useEffect(() => {
    const styleId = 'monaco-decorations-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .errorDecoration {
          background: rgba(248, 81, 73, 0.1);
          border-bottom: 2px wavy #f85149;
        }
        .warningDecoration {
          background: rgba(210, 153, 34, 0.1);
          border-bottom: 2px wavy #d29922;
        }
        .errorGlyphMargin {
          background: #f85149;
          width: 5px !important;
          margin-left: 3px;
        }
        .warningGlyphMargin {
          background: #d29922;
          width: 5px !important;
          margin-left: 3px;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  if (!activeFile) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        backgroundColor: 'var(--bg-primary)'
      }}>
        No active file. Select or create one from the sidebar.
      </div>
    );
  }

  // Determine file language based on extension
  const getLanguage = (fileName) => {
    if (fileName.endsWith('.c')) return 'c';
    if (fileName.endsWith('.h')) return 'c';
    if (fileName.endsWith('.cpp') || fileName.endsWith('.cc')) return 'cpp';
    if (fileName.endsWith('.txt')) return 'plaintext';
    return 'plaintext';
  };

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Editor
        height="100%"
        width="100%"
        language={getLanguage(activeFile.name)}
        value={activeFile.content}
        onChange={handleEditorChange}
        beforeMount={handleEditorBeforeMount}
        onMount={handleEditorDidMount}
        theme={editorTheme}
        options={{
          fontSize: fontSize,
          tabSize: tabSize,
          wordWrap: wordWrap,
          minimap: { enabled: minimap },
          automaticLayout: true,
          fontFamily: 'JetBrains Mono, monospace',
          fontLigatures: true,
          lineNumbers: 'on',
          folding: true,
          glyphMargin: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          renderLineHighlight: 'all',
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
};

export default CodeEditor;
export { CodeEditor };
