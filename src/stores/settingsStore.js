import { create } from 'zustand';

export const useSettingsStore = create((set) => {
  const getInitialSettings = () => {
    const saved = localStorage.getItem('codeforge_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing settings', e);
      }
    }
    return {
      theme: 'dark', // 'dark' | 'light'
      editorTheme: 'codeforge-dark', // 'codeforge-dark' | 'codeforge-light'
      fontSize: 14,
      tabSize: 4,
      wordWrap: 'on', // 'on' | 'off'
      minimap: true,
      autoSave: true,
      compilerFlags: '-O2 -Wall -lm',
    };
  };

  const initial = getInitialSettings();

  return {
    ...initial,
    
    updateSetting: (key, value) => set((state) => {
      const updated = { ...state, [key]: value };
      
      // Keep UI theme and Editor theme synchronized
      if (key === 'theme') {
        updated.editorTheme = value === 'dark' ? 'codeforge-dark' : 'codeforge-light';
        // Add/remove class to document element for global CSS
        if (value === 'light') {
          document.documentElement.classList.add('light-theme');
        } else {
          document.documentElement.classList.remove('light-theme');
        }
      }
      
      // Save clean state to localStorage (excluding functions)
      const cleanState = {};
      Object.keys(updated).forEach(k => {
        if (typeof updated[k] !== 'function') {
          cleanState[k] = updated[k];
        }
      });
      localStorage.setItem('codeforge_settings', JSON.stringify(cleanState));
      
      return updated;
    }),
    
    // Sync class list initially
    initializeTheme: () => {
      const currentTheme = getInitialSettings().theme;
      if (currentTheme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
    }
  };
});
