import React from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Settings, Eye, Type, AlignLeft, ShieldCheck, Sun, Moon } from 'lucide-react';

const SettingsPanel = () => {
  const theme = useSettingsStore((state) => state.theme);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const tabSize = useSettingsStore((state) => state.tabSize);
  const wordWrap = useSettingsStore((state) => state.wordWrap);
  const minimap = useSettingsStore((state) => state.minimap);
  const autoSave = useSettingsStore((state) => state.autoSave);
  const compilerFlags = useSettingsStore((state) => state.compilerFlags);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  const toggleTheme = () => {
    updateSetting('theme', theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      userSelect: 'none',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Settings size={16} className="gradient-text" />
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Settings</span>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Theme Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Sun size={14} />
            <span>Theme Mode</span>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
          >
            {theme === 'dark' ? (
              <>
                <Moon size={14} />
                <span>Switch to Light Theme</span>
              </>
            ) : (
              <>
                <Sun size={14} />
                <span>Switch to Dark Theme</span>
              </>
            )}
          </button>
        </div>

        {/* Font Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Type size={14} />
            <span>Font Size ({fontSize}px)</span>
          </div>
          <input
            type="range"
            min="10"
            max="24"
            step="1"
            value={fontSize}
            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--accent)',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Tab Size */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <AlignLeft size={14} />
            <span>Tab Size</span>
          </div>
          <select
            value={tabSize}
            onChange={(e) => updateSetting('tabSize', parseInt(e.target.value))}
            style={{
              padding: '6px 10px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="8">8 Spaces</option>
          </select>
        </div>

        {/* Editor Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Eye size={14} />
            <span>Editor Toggle Options</span>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={wordWrap === 'on'}
              onChange={(e) => updateSetting('wordWrap', e.target.checked ? 'on' : 'off')}
              style={{ accentColor: 'var(--accent)' }}
            />
            Word Wrap
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={minimap}
              onChange={(e) => updateSetting('minimap', e.target.checked)}
              style={{ accentColor: 'var(--accent)' }}
            />
            Show Minimap
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => updateSetting('autoSave', e.target.checked)}
              style={{ accentColor: 'var(--accent)' }}
            />
            Auto Save Changes
          </label>
        </div>

        {/* Compiler Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <ShieldCheck size={14} />
            <span>Compiler Flags</span>
          </div>
          <input
            type="text"
            value={compilerFlags}
            onChange={(e) => updateSetting('compilerFlags', e.target.value)}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
export { SettingsPanel };
