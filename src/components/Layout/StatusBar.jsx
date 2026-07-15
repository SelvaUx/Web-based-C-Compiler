import React from 'react';
import { useCompilerStore } from '../../stores/compilerStore';
import { useFileStore } from '../../stores/fileStore';
import { CheckCircle2, AlertTriangle, Loader2, HardDrive, Cpu, Clock, GitBranch } from 'lucide-react';

const StatusBar = () => {
  const isCompiling = useCompilerStore((state) => state.isCompiling);
  const isRunning = useCompilerStore((state) => state.isRunning);
  const executionTime = useCompilerStore((state) => state.executionTime);
  const memoryUsage = useCompilerStore((state) => state.memoryUsage);
  const cpuUsage = useCompilerStore((state) => state.cpuUsage);
  const rawError = useCompilerStore((state) => state.rawError);

  const files = useFileStore((state) => state.files);
  const activeFileId = useFileStore((state) => state.activeFileId);
  const activeFile = files.find(f => f.id === activeFileId);

  const isBusy = isCompiling || isRunning;

  const statusLabel = isCompiling ? 'Compiling…'
    : isRunning  ? 'Running…'
    : rawError   ? 'Build Failed'
    : 'Ready';

  const statusColor = isBusy ? 'var(--accent)'
    : rawError   ? 'var(--error)'
    : 'var(--success)';

  const StatusIcon = isBusy
    ? <Loader2 size={11} className="animate-spin" style={{ color: 'var(--accent)' }} />
    : rawError
    ? <AlertTriangle size={11} style={{ color: 'var(--error)' }} />
    : <CheckCircle2 size={11} style={{ color: 'var(--success)' }} />;

  return (
    <div style={{
      height: '24px',
      backgroundColor: 'var(--bg-tertiary)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      fontSize: '11px',
      color: 'var(--text-secondary)',
      userSelect: 'none',
      flexShrink: 0
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

        {/* Build status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {StatusIcon}
          <span style={{ fontWeight: 600, color: statusColor }}>{statusLabel}</span>
        </div>

        {/* Active file */}
        {activeFile && (
          <>
            <div style={{ width: '1px', height: '12px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>File:</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>
                {activeFile.name}
              </span>
              {activeFile.isUnsaved && (
                <span style={{
                  fontSize: '9px', fontWeight: 700,
                  color: 'var(--warning)',
                  backgroundColor: 'rgba(var(--warning-rgb), 0.12)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  border: '1px solid rgba(var(--warning-rgb), 0.25)'
                }}>UNSAVED</span>
              )}
            </div>
          </>
        )}

        <div style={{ width: '1px', height: '12px', background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <GitBranch size={10} />
          <a
            href="https://selvaux.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            Developer: Selva.Ux
          </a>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {executionTime > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={10} />
            <span>Time: <strong style={{ color: 'var(--text-primary)' }}>{executionTime.toFixed(2)}s</strong></span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <HardDrive size={10} />
          <span>RAM: <strong style={{ color: 'var(--text-primary)' }}>{memoryUsage}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Cpu size={10} />
          <span>CPU: <strong style={{ color: 'var(--text-primary)' }}>{cpuUsage}</strong></span>
        </div>

        <div style={{ width: '1px', height: '12px', background: 'var(--border)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.02em', fontSize: '10px' }}>LF</span>
        <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.02em', fontSize: '10px' }}>UTF-8</span>
        <span style={{
          color: 'var(--accent)',
          fontWeight: 600,
          fontSize: '10px',
          letterSpacing: '0.02em'
        }}>C Language</span>
      </div>
    </div>
  );
};

export default StatusBar;
export { StatusBar };
