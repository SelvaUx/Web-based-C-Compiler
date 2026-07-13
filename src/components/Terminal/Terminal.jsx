import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal as TerminalIcon, Copy, Trash2, Download, Keyboard } from 'lucide-react';
import { useCompilerStore } from '../../stores/compilerStore';
import toast from 'react-hot-toast';
import '@xterm/xterm/css/xterm.css';

const Terminal = () => {
  const terminalRef = useRef(null);
  const xtermInstance = useRef(null);
  const fitAddonInstance = useRef(null);
  const [stdinBuffer, setStdinBuffer] = useState('');
  const setTerminalWriteCallback = useCompilerStore((state) => state.setTerminalWriteCallback);

  useEffect(() => {
    // Initialize xterm
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      theme: {
        background: '#0d1117',
        foreground: '#e6edf3',
        cursor: '#58a6ff',
        selectionBackground: '#388bfd33',
        black: '#000000',
        red: '#f85149',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#e6edf3',
      },
      convertEol: true
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    // Welcome message
    term.write('\x1b[35m=== CodeForge Interactive Console ===\x1b[0m\r\n');
    term.write('\x1b[90mType inputs here before clicking Run. Press Enter to submit.\x1b[0m\r\n\r\n');

    // Handle user inputs in terminal
    let inputAccumulator = '';
    term.onData((data) => {
      // If it's a carriage return or line feed
      if (data === '\r' || data === '\n') {
        term.write('\r\n');
        setStdinBuffer((prev) => prev + inputAccumulator + '\n');
        inputAccumulator = '';
      } else if (data === '\x7f') {
        // Backspace
        if (inputAccumulator.length > 0) {
          inputAccumulator = inputAccumulator.slice(0, -1);
          term.write('\b \b'); // erase character from terminal screen
        }
      } else {
        inputAccumulator += data;
        term.write(data); // echo character
      }
    });

    xtermInstance.current = term;
    fitAddonInstance.current = fitAddon;

    // Connect compilerStore to write to this terminal
    setTerminalWriteCallback((text) => term.write(text));

    // Handle window resize
    const handleResize = () => {
      if (fitAddonInstance.current) {
        fitAddonInstance.current.fit();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [setTerminalWriteCallback]);

  const handleClear = () => {
    if (xtermInstance.current) {
      xtermInstance.current.clear();
      xtermInstance.current.write('\x1b[35m=== Console Cleared ===\x1b[0m\r\n\r\n');
      setStdinBuffer('');
    }
  };

  const handleCopy = () => {
    // Select all text and copy
    if (xtermInstance.current) {
      // In xterm.js, there is no direct full text retrieval easily in v5 without buffer iterations.
      // So we can parse the buffer manually or let the user select.
      // But we can extract text from the active buffer lines.
      const buffer = xtermInstance.current.buffer.active;
      let text = '';
      for (let i = 0; i < buffer.length; i++) {
        const line = buffer.getLine(i);
        if (line) {
          text += line.translateToString() + '\n';
        }
      }
      navigator.clipboard.writeText(text.trim());
      toast.success('Terminal output copied!');
    }
  };

  const handleDownload = () => {
    if (xtermInstance.current) {
      const buffer = xtermInstance.current.buffer.active;
      let text = '';
      for (let i = 0; i < buffer.length; i++) {
        const line = buffer.getLine(i);
        if (line) {
          text += line.translateToString() + '\n';
        }
      }
      
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'terminal_output.txt';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Terminal output downloaded!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Terminal Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TerminalIcon size={16} className="gradient-text" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Terminal</span>
          {stdinBuffer && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
              <Keyboard size={12} color="var(--accent)" />
              <span style={{ fontSize: '10px', color: 'var(--accent)' }}>Stdin buffered</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={handleCopy} 
            title="Copy Terminal Output"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'none'}
          >
            <Copy size={14} />
          </button>
          <button 
            onClick={handleDownload} 
            title="Download Log"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'none'}
          >
            <Download size={14} />
          </button>
          <button 
            onClick={handleClear} 
            title="Clear Terminal"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'none'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Terminal View Container */}
      <div 
        ref={terminalRef} 
        style={{ 
          flex: 1, 
          width: '100%', 
          backgroundColor: '#0d1117',
          padding: '8px',
          overflow: 'hidden'
        }} 
      />
    </div>
  );
};

export default Terminal;
export { Terminal };
