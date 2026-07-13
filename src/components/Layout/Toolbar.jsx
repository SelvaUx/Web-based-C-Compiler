import React from 'react';
import { useCompilerStore } from '../../stores/compilerStore';
import { useFileStore } from '../../stores/fileStore';
import { Play, Square, RefreshCw, Layers, SlidersHorizontal, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Toolbar = () => {
  const isCompiling = useCompilerStore((state) => state.isCompiling);
  const isRunning = useCompilerStore((state) => state.isRunning);
  const runCode = useCompilerStore((state) => state.runCode);
  const clearOutput = useCompilerStore((state) => state.clearOutput);
  
  const files = useFileStore((state) => state.files);
  const activeFileId = useFileStore((state) => state.activeFileId);
  const saveFile = useFileStore((state) => state.saveFile);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleRun = async () => {
    if (!activeFile) {
      toast.error('No active file to run!');
      return;
    }

    // Save before run
    if (activeFile.isUnsaved) {
      await saveFile(activeFile.id);
    }

    // Start compilation & execution
    runCode(activeFile.content);
  };

  const handleStop = () => {
    toast.error('Execution aborted.');
  };

  return (
    <div style={{
      height: '50px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      userSelect: 'none'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: 'var(--grad-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '16px',
          color: '#fff'
        }}>
          C
        </div>
        <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          CodeForge<span className="gradient-text" style={{ fontWeight: 800 }}>IDE</span>
        </span>
      </div>

      {/* Compiler Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleRun}
          disabled={isCompiling || isRunning}
          className="glow-btn"
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            opacity: (isCompiling || isRunning) ? 0.6 : 1,
            pointerEvents: (isCompiling || isRunning) ? 'none' : 'auto'
          }}
        >
          {isCompiling ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Compiling...</span>
            </>
          ) : isRunning ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play size={14} fill="#fff" />
              <span>Compile & Run</span>
            </>
          )}
        </button>

        {(isCompiling || isRunning) && (
          <button
            onClick={handleStop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--error)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            <Square size={14} fill="#fff" />
            <span>Stop</span>
          </button>
        )}

        <button
          onClick={clearOutput}
          title="Clear Console Output"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            padding: '8px 14px',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Trash2 size={14} />
          <span>Clear Console</span>
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--surface)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid var(--border)'
        }}>
          GCC 11.2.0
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
export { Toolbar };
