import React from 'react';
import { Files, Code, Settings, Terminal, Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

const ActivityBar = ({ activePanel, setActivePanel }) => {
  const theme = useSettingsStore((state) => state.theme);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  const toggleTheme = () => {
    updateSetting('theme', theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { id: 'files', icon: Files, label: 'File Explorer' },
    { id: 'snippets', icon: Code, label: 'Code Templates' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div style={{
      width: '48px',
      backgroundColor: 'var(--bg-tertiary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      userSelect: 'none'
    }}>
      {/* Top Action Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
        {navItems.map((item) => {
          const isActive = activePanel === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(isActive ? null : item.id)}
              title={item.label}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Icon size={20} />
              
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '15%',
                  height: '70%',
                  width: '3px',
                  background: 'var(--grad-accent)',
                  borderRadius: '0 4px 4px 0'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Switch theme button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color var(--transition-fast), color var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
};

export default ActivityBar;
export { ActivityBar };
