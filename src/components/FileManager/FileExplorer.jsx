import React, { useState } from 'react';
import { useFileStore } from '../../stores/fileStore';
import { 
  FilePlus, FolderPlus, Upload, Download, Edit2, Trash2, FileCode, Check, X, File 
} from 'lucide-react';
import toast from 'react-hot-toast';

const FileExplorer = () => {
  const files = useFileStore((state) => state.files);
  const activeFileId = useFileStore((state) => state.activeFileId);
  const setActiveFile = useFileStore((state) => state.setActiveFile);
  const createFile = useFileStore((state) => state.createFile);
  const renameFile = useFileStore((state) => state.renameFile);
  const deleteFile = useFileStore((state) => state.deleteFile);

  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    
    // Ensure .c suffix if no extension is specified
    let name = newFileName.trim();
    if (!name.includes('.')) {
      name += '.c';
    }

    // Check if filename already exists
    if (files.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      toast.error('File already exists!');
      return;
    }

    await createFile(name, `// ${name}\n#include <stdio.h>\n\nint main() {\n    printf("Running ${name}!\\n");\n    return 0;\n}\n`);
    setNewFileName('');
    setIsCreating(false);
    toast.success('File created!');
  };

  const handleRename = async (id) => {
    if (!editingName.trim()) return;
    if (files.some(f => f.id !== id && f.name.toLowerCase() === editingName.toLowerCase())) {
      toast.error('File name already exists!');
      return;
    }
    await renameFile(id, editingName.trim());
    setEditingId(null);
    toast.success('File renamed!');
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteFile(id);
      toast.success('File deleted');
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target.result;
      const uploadedFile = await createFile(file.name, content);
      toast.success(`Uploaded: ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  };

  const handleDownloadFile = (file) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: ${file.name}`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      userSelect: 'none'
    }}>
      {/* Sidebar Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Files</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* New file button */}
          <button 
            onClick={() => setIsCreating(true)} 
            title="New File"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FilePlus size={16} />
          </button>
          {/* Upload file button */}
          <label 
            title="Upload C File"
            style={{
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Upload size={16} />
            <input 
              type="file" 
              accept=".c,.h,.txt" 
              onChange={handleUpload} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
      </div>

      {/* Creation form */}
      {isCreating && (
        <form onSubmit={handleCreate} style={{ padding: '8px 12px', display: 'flex', gap: '6px', borderBottom: '1px solid var(--border)' }}>
          <input
            type="text"
            placeholder="filename.c"
            autoFocus
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '4px 8px',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', padding: '2px' }}><Check size={14} /></button>
          <button type="button" onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '2px' }}><X size={14} /></button>
        </form>
      )}

      {/* Files List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {files.map((file) => {
          const isActive = activeFileId === file.id;
          const isEditing = editingId === file.id;

          return (
            <div
              key={file.id}
              onClick={() => !isEditing && setActiveFile(file.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 16px',
                backgroundColor: isActive ? 'var(--surface-hover)' : 'transparent',
                cursor: isEditing ? 'default' : 'pointer',
                transition: 'background-color var(--transition-fast)',
                group: 'true'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                const btns = e.currentTarget.querySelector('.file-actions');
                if (btns) btns.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                const btns = e.currentTarget.querySelector('.file-actions');
                if (btns) btns.style.opacity = '0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, overflow: 'hidden' }}>
                <FileCode size={16} color={isActive ? 'var(--accent)' : 'var(--text-secondary)'} />
                
                {isEditing ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)}
                    autoFocus
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--accent)',
                      borderRadius: '3px',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      padding: '2px 4px',
                      width: '80%',
                      outline: 'none'
                    }}
                  />
                ) : (
                  <span style={{
                    fontSize: '13px',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 400,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}>
                    {file.name}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div 
                className="file-actions"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: 0,
                  transition: 'opacity var(--transition-fast)'
                }}
              >
                {isEditing ? (
                  <>
                    <button onClick={() => handleRename(file.id)} style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer' }}><Check size={12} /></button>
                    <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><X size={12} /></button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(file.id);
                        setEditingName(file.name);
                      }} 
                      title="Rename"
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadFile(file);
                      }} 
                      title="Download"
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                    >
                      <Download size={12} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id, file.name);
                      }} 
                      title="Delete"
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileExplorer;
export { FileExplorer };
