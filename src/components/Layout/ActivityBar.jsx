import React from 'react';
import { Files, Code2, Settings2, Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

const navItems = [
  { id: 'files',    icon: Files,    label: 'File Explorer' },
  { id: 'snippets', icon: Code2,    label: 'Code Templates' },
  { id: 'settings', icon: Settings2, label: 'Settings' },
];

const ActivityBar = ({ activePanel, setActivePanel }) => {
  const theme = useSettingsStore((state) => state.theme);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  const toggleTheme = () =>
    updateSetting('theme', theme === 'dark' ? 'light' : 'dark');

  return (
    <div style={{
      width: '48px',
      backgroundColor: 'var(--bg-tertiary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      userSelect: 'none',
      flexShrink: 0
    }}>
      {/* Top nav icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', alignItems: 'center' }}>
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activePanel === id;
          return (
            <button
              key={id}
              onClick={() => setActivePanel(isActive ? null : id)}
              title={label}
              style={{
                background: isActive ? 'rgba(var(--accent-rgb), 0.1)' : 'none',
                border: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                borderRadius: '0',
                transition: 'color var(--transition-fast), background var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--surface-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'none';
                }
              }}
            >
              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />

              {/* Active indicator strip */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '18%',
                  height: '64%',
                  width: '3px',
                  background: 'var(--grad-accent)',
                  borderRadius: '0 4px 4px 0',
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom: theme toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--transition-fast), color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'var(--surface-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'none';
          }}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </div>
  );
};

export default ActivityBar;
export { ActivityBar };
