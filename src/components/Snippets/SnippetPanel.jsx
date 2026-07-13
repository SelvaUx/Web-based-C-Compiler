import React, { useState } from 'react';
import { snippets } from '../../data/snippets';
import { useFileStore } from '../../stores/fileStore';
import { Code, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SnippetPanel = () => {
  const createFile = useFileStore((state) => state.createFile);
  const [selectedSnippet, setSelectedSnippet] = useState(snippets[0]);

  const categories = Array.from(new Set(snippets.map(s => s.category)));

  const handleLoadSnippet = async (snippet) => {
    const defaultName = `${snippet.id}.c`;
    await createFile(defaultName, snippet.code);
    toast.success(`Loaded ${snippet.title}!`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      userSelect: 'none',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Code size={16} className="gradient-text" />
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Templates</span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Categories / Snippets list */}
        <div style={{
          width: '100%',
          overflowY: 'auto',
          borderRight: '1px solid var(--border)',
          padding: '8px 0'
        }}>
          {categories.map(category => (
            <div key={category}>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                padding: '8px 16px 4px 16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {category}
              </div>
              
              {snippets
                .filter(s => s.category === category)
                .map(snippet => {
                  const isSelected = selectedSnippet.id === snippet.id;
                  return (
                    <div
                      key={snippet.id}
                      onClick={() => setSelectedSnippet(snippet)}
                      style={{
                        padding: '8px 20px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--surface-hover)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: isSelected ? 600 : 400,
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}>
                          {snippet.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadSnippet(snippet);
                        }}
                        title="Load Template into IDE"
                        style={{
                          background: 'var(--grad-accent)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '3px'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SnippetPanel;
export { SnippetPanel };
