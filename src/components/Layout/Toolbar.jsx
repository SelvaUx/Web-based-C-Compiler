import React from 'react';
import { useCompilerStore } from '../../stores/compilerStore';
import { useFileStore } from '../../stores/fileStore';
import { Play, Square, RefreshCw, Trash2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Toolbar = () => {
  const isCompiling = useCompilerStore((state) => state.isCompiling);
  const isRunning = useCompilerStore((state) => state.isRunning);
  const runCode = useCompilerStore((state) => state.runCode);
  const clearOutput = useCompilerStore((state) => state.clearOutput);
  const stdin = useCompilerStore((state) => state.stdin);

  const files = useFileStore((state) => state.files);
  const activeFileId = useFileStore((state) => state.activeFileId);
  const saveFile = useFileStore((state) => state.saveFile);

  const activeFile = files.find(f => f.id === activeFileId);
  const isBusy = isCompiling || isRunning;

  const handleRun = async () => {
    if (!activeFile) {
      toast.error('No active file to run!');
      return;
    }
    if (activeFile.isUnsaved) {
      await saveFile(activeFile.id);
    }
    runCode(activeFile.content, stdin);
  };

  const handleStop = () => {
    toast.error('Execution aborted.');
  };

  return (
    <div
      className={isBusy ? 'is-compiling' : ''}
      style={{
        height: '52px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        userSelect: 'none',
        position: 'relative',
        gap: '12px'
      }}
    >
      {/* Animated glow line when compiling */}
      <div className="toolbar-glow-line" />

      {/* ── Brand ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          background: 'var(--grad-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 14px rgba(56,139,253,0.35)',
          flexShrink: 0
        }}>
          <Zap size={16} color="#fff" strokeWidth={2.5} />
        </div>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            CodeForge<span className="gradient-text" style={{ fontWeight: 800 }}>IDE</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em', marginTop: '1px' }}>
            C COMPILER
          </div>
        </div>
      </div>

      {/* ── Center: File name tag ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {activeFile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '7px',
            padding: '4px 10px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            maxWidth: '220px'
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: activeFile.isUnsaved ? 'var(--warning)' : 'var(--success)',
              flexShrink: 0,
              boxShadow: `0 0 5px ${activeFile.isUnsaved ? 'var(--warning)' : 'var(--success)'}`
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {activeFile.name}
            </span>
            {activeFile.isUnsaved && (
              <span style={{ color: 'var(--warning)', fontSize: '10px', flexShrink: 0 }}>●</span>
            )}
          </div>
        )}
      </div>

      {/* ── Right: Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Clear console */}
        <button className="ghost-btn" onClick={clearOutput} title="Clear Console">
          <Trash2 size={13} />
          <span>Clear</span>
        </button>

        {/* Stop button (only while busy) */}
        {isBusy && (
          <button
            onClick={handleStop}
            className="animate-fadeIn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(var(--error-rgb), 0.12)',
              border: '1px solid rgba(var(--error-rgb), 0.35)',
              borderRadius: '7px',
              color: 'var(--error)',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Square size={12} fill="currentColor" />
            <span>Stop</span>
          </button>
        )}

        {/* Compile & Run */}
        <button
          onClick={handleRun}
          disabled={isBusy}
          className="glow-btn"
          style={{
            padding: '8px 18px',
            fontSize: '13px',
            opacity: isBusy ? 0.65 : 1,
            pointerEvents: isBusy ? 'none' : 'auto'
          }}
        >
          {isCompiling ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              <span>Compiling…</span>
            </>
          ) : isRunning ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              <span>Running…</span>
            </>
          ) : (
            <>
              <Play size={13} fill="#fff" />
              <span>Compile &amp; Run</span>
            </>
          )}
        </button>

        {/* Compiler version badge */}
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '4px 8px',
          borderRadius: '5px',
          border: '1px solid var(--border)',
          letterSpacing: '0.03em',
          fontFamily: 'var(--font-mono)'
        }}>
          GCC 11.2
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
