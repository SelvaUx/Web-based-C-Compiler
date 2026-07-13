import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Toaster } from 'react-hot-toast';
import { useFileStore } from './stores/fileStore';
import { useSettingsStore } from './stores/settingsStore';

// Components
import Toolbar from './components/Layout/Toolbar';
import ActivityBar from './components/Layout/ActivityBar';
import StatusBar from './components/Layout/StatusBar';
import FileExplorer from './components/FileManager/FileExplorer';
import SnippetPanel from './components/Snippets/SnippetPanel';
import SettingsPanel from './components/Settings/SettingsPanel';
import EditorTabs from './components/Editor/EditorTabs';
import CodeEditor from './components/Editor/CodeEditor';
import Terminal from './components/Terminal/Terminal';

function App() {
  const initStore = useFileStore((state) => state.initStore);
  const initializeTheme = useSettingsStore((state) => state.initializeTheme);
  const [activePanel, setActivePanel] = useState('files'); // 'files' | 'snippets' | 'settings' | null

  // Load files from IndexedDB and set theme on startup
  useEffect(() => {
    initStore();
    initializeTheme();
  }, [initStore, initializeTheme]);

  const renderSidebarContent = () => {
    switch (activePanel) {
      case 'files':
        return <FileExplorer />;
      case 'snippets':
        return <SnippetPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="ide-container">
      {/* Notifications system toast provider */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)'
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'var(--bg-secondary)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--error)',
              secondary: 'var(--bg-secondary)',
            },
          },
        }}
      />

      {/* Top Action Bar */}
      <Toolbar />

      {/* Workspace Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Left Side Activity Bar */}
        <ActivityBar activePanel={activePanel} setActivePanel={setActivePanel} />

        {/* Dynamic resizable layout panels */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <PanelGroup direction="horizontal">
            {/* Sidebar content panel (Files / Snippets / Settings) */}
            {activePanel && (
              <>
                <Panel defaultSize={20} minSize={15} maxSize={35}>
                  {renderSidebarContent()}
                </Panel>
                <PanelResizeHandle className="ResizeHandle ResizeHandleHorizontal" />
              </>
            )}

            {/* Main Code Editor & Console layout */}
            <Panel defaultSize={activePanel ? 80 : 100}>
              <PanelGroup direction="vertical">
                {/* Monaco Editor Tab and Content view */}
                <Panel defaultSize={65} minSize={30}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <EditorTabs />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <CodeEditor />
                    </div>
                  </div>
                </Panel>
                
                {/* Horizontal draggable divider handle */}
                <PanelResizeHandle className="ResizeHandle ResizeHandleVertical" />
                
                {/* Output Terminal Console view */}
                <Panel defaultSize={35} minSize={15}>
                  <Terminal />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      </div>

      {/* Bottom Status bar */}
      <StatusBar />
    </div>
  );
}

export default App;
