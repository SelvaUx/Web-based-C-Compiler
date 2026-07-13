import React from 'react';
import { useFileStore } from '../../stores/fileStore';
import { X, FileCode, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EditorTabs = () => {
  const files = useFileStore((state) => state.files);
  const openTabs = useFileStore((state) => state.openTabs);
  const activeFileId = useFileStore((state) => state.activeFileId);
  const setActiveFile = useFileStore((state) => state.setActiveFile);
  const closeTab = useFileStore((state) => state.closeTab);
  const saveFile = useFileStore((state) => state.saveFile);

  const handleTabClick = (id) => {
    setActiveFile(id);
  };

  const handleCloseClick = (e, id) => {
    e.stopPropagation();
    closeTab(id);
  };

  const handleSaveTab = async (e, id) => {
    e.stopPropagation();
    await saveFile(id);
    toast.success('File saved!');
  };

  if (openTabs.length === 0) {
    return (
      <div style={{
        height: '35px',
        backgroundColor: 'var(--bg-tertiary)',
        borderBottom: '1px solid var(--border)'
      }} />
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '35px',
      backgroundColor: 'var(--bg-tertiary)',
      borderBottom: '1px solid var(--border)',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      userSelect: 'none'
    }}>
      {openTabs.map((tabId) => {
        const file = files.find(f => f.id === tabId);
        if (!file) return null;

        const isActive = activeFileId === tabId;

        return (
          <div
            key={tabId}
            onClick={() => handleTabClick(tabId)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              height: '100%',
              backgroundColor: isActive ? 'var(--bg-primary)' : 'var(--bg-secondary)',
              borderRight: '1px solid var(--border)',
              borderBottom: isActive ? '1px solid var(--bg-primary)' : 'none',
              cursor: 'pointer',
              gap: '8px',
              position: 'relative'
            }}
          >
            <FileCode size={14} color={isActive ? 'var(--accent)' : 'var(--text-secondary)'} />
            <span style={{
              fontSize: '12px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}>
              {file.name}
            </span>

            {/* Status indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {file.isUnsaved && (
                <button
                  onClick={(e) => handleSaveTab(e, tabId)}
                  title="Unsaved changes - click to save"
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--warning)',
                  }} />
                </button>
              )}
              
              <button
                onClick={(e) => handleCloseClick(e, tabId)}
                title="Close file"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px',
                  borderRadius: '3px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={12} />
              </button>
            </div>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'var(--grad-accent)'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EditorTabs;
export { EditorTabs };
