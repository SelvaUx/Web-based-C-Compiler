import { create } from 'zustand';
import { openDB } from 'idb';

const DB_NAME = 'codeforge_ide_db';
const STORE_NAME = 'files';

// Initialize IndexedDB
const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const useFileStore = create((set, get) => ({
  files: [],
  activeFileId: null,
  openTabs: [], // array of fileIds currently open in editor tabs

  // Initialize DB and load files
  initStore: async () => {
    try {
      const db = await dbPromise;
      const allFiles = await db.getAll(STORE_NAME);
      
      if (allFiles.length === 0) {
        // Seed default file
        const defaultFile = {
          id: 'main.c',
          name: 'main.c',
          content: `#include <stdio.h>\n\nint main() {\n    printf("Welcome to CodeForge IDE!\\n");\n    printf("Run this code or open files from the sidebar.\\n");\n    return 0;\n}\n`,
          updatedAt: Date.now(),
          isUnsaved: false
        };
        await db.put(STORE_NAME, defaultFile);
        set({
          files: [defaultFile],
          activeFileId: 'main.c',
          openTabs: ['main.c']
        });
      } else {
        // Set state from DB
        set({
          files: allFiles,
          activeFileId: allFiles[0].id,
          openTabs: [allFiles[0].id]
        });
      }
    } catch (error) {
      console.error('Failed to initialize IndexedDB store:', error);
      // Fallback in-memory seed if IndexedDB fails
      const fallbackFile = {
        id: 'main.c',
        name: 'main.c',
        content: `#include <stdio.h>\n\nint main() {\n    printf("Hello World! (IndexedDB Failed - Memory Only Mode)\\n");\n    return 0;\n}\n`,
        updatedAt: Date.now(),
        isUnsaved: false
      };
      set({
        files: [fallbackFile],
        activeFileId: 'main.c',
        openTabs: ['main.c']
      });
    }
  },

  setActiveFile: (fileId) => {
    const { openTabs } = get();
    const updatedTabs = openTabs.includes(fileId) 
      ? openTabs 
      : [...openTabs, fileId];
    
    set({
      activeFileId: fileId,
      openTabs: updatedTabs
    });
  },

  updateFileContent: async (fileId, newContent) => {
    const { files } = get();
    const updatedFiles = files.map(f => {
      if (f.id === fileId) {
        return { ...f, content: newContent, isUnsaved: true, updatedAt: Date.now() };
      }
      return f;
    });

    set({ files: updatedFiles });
  },

  saveFile: async (fileId) => {
    const { files } = get();
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const savedFile = { ...file, isUnsaved: false };
    
    try {
      const db = await dbPromise;
      await db.put(STORE_NAME, savedFile);
      
      set({
        files: files.map(f => f.id === fileId ? savedFile : f)
      });
    } catch (e) {
      console.error('Failed to save file to IndexedDB:', e);
    }
  },

  createFile: async (name, content = '') => {
    const { files, openTabs } = get();
    const id = name.replace(/\s+/g, '_') + '_' + Date.now();
    const newFile = {
      id,
      name,
      content,
      updatedAt: Date.now(),
      isUnsaved: false
    };

    try {
      const db = await dbPromise;
      await db.put(STORE_NAME, newFile);
      
      set({
        files: [...files, newFile],
        activeFileId: id,
        openTabs: [...openTabs, id]
      });
    } catch (e) {
      console.error('Failed to create file in IndexedDB:', e);
    }
    return newFile;
  },

  renameFile: async (fileId, newName) => {
    const { files } = get();
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const updatedFile = { ...file, name: newName, updatedAt: Date.now() };
    
    try {
      const db = await dbPromise;
      await db.put(STORE_NAME, updatedFile);
      
      set({
        files: files.map(f => f.id === fileId ? updatedFile : f)
      });
    } catch (e) {
      console.error('Failed to rename file in IndexedDB:', e);
    }
  },

  deleteFile: async (fileId) => {
    const { files, openTabs, activeFileId } = get();
    
    try {
      const db = await dbPromise;
      await db.delete(STORE_NAME, fileId);
      
      const filteredFiles = files.filter(f => f.id !== fileId);
      const filteredTabs = openTabs.filter(id => id !== fileId);
      
      let nextActiveId = activeFileId;
      if (activeFileId === fileId) {
        nextActiveId = filteredTabs.length > 0 ? filteredTabs[0] : (filteredFiles.length > 0 ? filteredFiles[0].id : null);
      }

      set({
        files: filteredFiles,
        openTabs: filteredTabs,
        activeFileId: nextActiveId
      });
    } catch (e) {
      console.error('Failed to delete file from IndexedDB:', e);
    }
  },

  closeTab: (fileId) => {
    const { openTabs, activeFileId } = get();
    const filteredTabs = openTabs.filter(id => id !== fileId);
    
    let nextActiveId = activeFileId;
    if (activeFileId === fileId) {
      nextActiveId = filteredTabs.length > 0 ? filteredTabs[filteredTabs.length - 1] : null;
    }

    set({
      openTabs: filteredTabs,
      activeFileId: nextActiveId
    });
  }
}));
