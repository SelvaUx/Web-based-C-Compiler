import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal as TerminalIcon, Copy, Trash2, Download, Keyboard, Info } from 'lucide-react';
import { useCompilerStore } from '../../stores/compilerStore';
import toast from 'react-hot-toast';
import '@xterm/xterm/css/xterm.css';

const Terminal = () => {
  const terminalRef = useRef(null);
  const xtermInstance = useRef(null);
  const fitAddonInstance = useRef(null);

  const stdin = useCompilerStore((state) => state.stdin);
  const setStdin = useCompilerStore((state) => state.setStdin);
  const setTerminalWriteCallback = useCompilerStore((state) => state.setTerminalWriteCallback);

  useEffect(() => {
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineHeight: 1.55,
      theme: {
        background:          '#0d1117',
        foreground:          '#e6edf3',
        cursor:              '#388bfd',
        cursorAccent:        '#0d1117',
        selectionBackground: 'rgba(56,139,253,0.22)',
        black:   '#21262d',
        red:     '#f85149',
        green:   '#3fb950',
        yellow:  '#d29922',
        blue:    '#388bfd',
        magenta: '#bc8cff',
        cyan:    '#39c5cf',
        white:   '#e6edf3',
        brightBlack:   '#484f58',
        brightRed:     '#ff7b72',
        brightGreen:   '#56d364',
        brightYellow:  '#e3b341',
        brightBlue:    '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan:    '#56d4dd',
        brightWhite:   '#f0f6fc',
      },
      convertEol: true,
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    setTimeout(() => {
      if (fitAddonInstance.current) fitAddonInstance.current.fit();
    }, 80);

    // Welcome message
    term.write('\x1b[38;5;99m  ╔═══════════════════════════════╗\x1b[0m\r\n');
    term.write('\x1b[38;5;99m  ║  \x1b[1;97mCodeForge IDE  \x1b[0m\x1b[38;5;69m Console      \x1b[38;5;99m║\x1b[0m\r\n');
    term.write('\x1b[38;5;99m  ╚═══════════════════════════════╝\x1b[0m\r\n');
    term.write('\x1b[90m  Add inputs on the right → then click Compile & Run\x1b[0m\r\n\r\n');

    // Handle user input in terminal (echoed to stdin store)
    let inputAccumulator = '';
    term.onData((data) => {
      if (data === '\r' || data === '\n') {
        term.write('\r\n');
        setStdin((prev) => prev + inputAccumulator + '\n');
        inputAccumulator = '';
      } else if (data === '\x7f') {
        if (inputAccumulator.length > 0) {
          inputAccumulator = inputAccumulator.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        inputAccumulator += data;
        term.write(data);
      }
    });

    xtermInstance.current = term;
    fitAddonInstance.current = fitAddon;
    setTerminalWriteCallback((text) => term.write(text));

    const handleResize = () => fitAddonInstance.current?.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [setTerminalWriteCallback, setStdin]);

  useEffect(() => {
    const t = setTimeout(() => fitAddonInstance.current?.fit(), 120);
    return () => clearTimeout(t);
  });

  const handleClear = () => {
    xtermInstance.current?.clear();
    xtermInstance.current?.write('\x1b[35m  Console cleared.\x1b[0m\r\n\r\n');
    setStdin('');
  };

  const handleCopy = () => {
    const buf = xtermInstance.current?.buffer.active;
    if (!buf) return;
    let text = '';
    for (let i = 0; i < buf.length; i++) {
      const line = buf.getLine(i);
      if (line) text += line.translateToString() + '\n';
    }
    navigator.clipboard.writeText(text.trim());
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    const buf = xtermInstance.current?.buffer.active;
    if (!buf) return;
    let text = '';
    for (let i = 0; i < buf.length; i++) {
      const line = buf.getLine(i);
      if (line) text += line.translateToString() + '\n';
    }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'output.txt'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Output downloaded!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>

      {/* ── Terminal Toolbar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 10px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        userSelect: 'none',
        flexShrink: 0,
        height: '34px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <TerminalIcon size={14} className="gradient-text" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Terminal
          </span>
          {stdin && (
            <span className="badge badge-accent animate-fadeIn">
              <Keyboard size={9} />
              Stdin set
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {[
            { icon: Copy,     label: 'Copy output',   fn: handleCopy },
            { icon: Download, label: 'Download log',  fn: handleDownload },
            { icon: Trash2,   label: 'Clear terminal',fn: handleClear },
          ].map(({ icon: Icon, label, fn }) => (
            <button key={label} className="icon-btn" onClick={fn} title={label}>
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Main viewport: xterm + stdin panel ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* xterm output */}
        <div
          ref={terminalRef}
          style={{
            flex: 1,
            backgroundColor: '#0d1117',
            padding: '6px',
            overflow: 'hidden',
            minWidth: 0,
          }}
        />

        {/* Stdin input panel */}
        <div style={{
          width: '240px',
          minWidth: '200px',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          {/* Panel header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 10px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg-tertiary)',
            flexShrink: 0,
            height: '34px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>
              <Keyboard size={11} />
              <span>Program Input</span>
            </div>
            <Info
              size={11}
              style={{ color: 'var(--text-muted)', cursor: 'help', flexShrink: 0 }}
              title="Type inputs your program needs (e.g. scanf values). One value per line. These are passed as stdin when you click Compile & Run."
            />
          </div>

          {/* Textarea */}
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder={'Enter inputs here…\n(one per line)\n\nExample:\n5\nhello\n3.14'}
            spellCheck={false}
            style={{
              flex: 1,
              backgroundColor: '#0d1117',
              border: 'none',
              color: '#e6edf3',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12.5px',
              lineHeight: '1.6',
              padding: '10px 12px',
              resize: 'none',
              outline: 'none',
              width: '100%',
            }}
          />

          {/* Footer hint */}
          <div style={{
            padding: '5px 10px',
            borderTop: '1px solid var(--border)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <span>{stdin.split('\n').filter(Boolean).length} line{stdin.split('\n').filter(Boolean).length !== 1 ? 's' : ''}</span>
            {stdin && (
              <button
                onClick={() => setStdin('')}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '10px', cursor: 'pointer',
                  padding: '1px 4px', borderRadius: '3px',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                title="Clear all inputs"
              >
                clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
export { Terminal };
