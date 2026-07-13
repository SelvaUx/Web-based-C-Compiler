import React from 'react';
import { useCompilerStore } from '../../stores/compilerStore';
import { useFileStore } from '../../stores/fileStore';
import { Play, CheckCircle2, AlertTriangle, Info, HardDrive, Cpu, Terminal } from 'lucide-react';

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

  const getStatusText = () => {
    if (isCompiling) return 'Compiling...';
    if (isRunning) return 'Running...';
    if (rawError) return 'Build Failed';
    return 'Ready';
  };

  const getStatusColor = () => {
    if (isCompiling || isRunning) return 'var(--accent)';
    if (rawError) return 'var(--error)';
    return 'var(--success)';
  };

  const getStatusIcon = () => {
    if (isCompiling || isRunning) return <Play size={12} className="animate-pulse" style={{ color: 'var(--accent)' }} />;
    if (rawError) return <AlertTriangle size={12} style={{ color: 'var(--error)' }} />;
    return <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />;
  };

  return (
    <div style={{
      height: '24px',
      backgroundColor: 'var(--bg-tertiary)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      fontSize: '11px',
      color: 'var(--text-secondary)',
      userSelect: 'none'
    }}>
      {/* Left panel: Build status & current file */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {getStatusIcon()}
          <span style={{ fontWeight: 600, color: getStatusColor() }}>
            {getStatusText()}
          </span>
        </div>
        
        {activeFile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>File:</span>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{activeFile.name}</span>
          </div>
        )}

        <span style={{ color: 'var(--border)' }}>|</span>
        <a 
          href="https://selvaux.in" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            color: 'var(--text-secondary)', 
            textDecoration: 'none', 
            transition: 'color var(--transition-fast)' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Developer: Selva.Ux
        </a>
      </div>

      {/* Right panel: Performance metrics & coding configs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Performance stats if available */}
        {executionTime > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Terminal size={11} />
            <span>Time: <strong style={{ color: 'var(--text-primary)' }}>{executionTime.toFixed(2)}s</strong></span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <HardDrive size={11} />
          <span>RAM: <strong style={{ color: 'var(--text-primary)' }}>{memoryUsage}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Cpu size={11} />
          <span>CPU: <strong style={{ color: 'var(--text-primary)' }}>{cpuUsage}</strong></span>
        </div>

        <span style={{ color: 'var(--border)' }}>|</span>
        
        <span>LF</span>
        <span>UTF-8</span>
        <span>C Language</span>
      </div>
    </div>
  );
};

export default StatusBar;
export { StatusBar };
