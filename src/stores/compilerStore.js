import { create } from 'zustand';
import { compileAndRun, parseErrors } from '../services/compiler';

export const useCompilerStore = create((set, get) => ({
  isCompiling: false,
  isRunning: false,
  output: '',
  errors: [],
  rawError: '',
  executionTime: 0,
  memoryUsage: '4 MB', // mock display matching layout specs
  cpuUsage: '3%',     // mock display matching layout specs
  exitStatus: 0,
  terminalWriteCallback: null, // Callback to write to xterm.js instance

  setTerminalWriteCallback: (callback) => set({ terminalWriteCallback: callback }),

  clearOutput: () => {
    set({ output: '', errors: [], rawError: '', executionTime: 0 });
    const write = get().terminalWriteCallback;
    if (write) {
      write('\x1b[2J\x1b[H'); // ANSI escape to clear terminal and home cursor
    }
  },

  runCode: async (code, stdin = '') => {
    set({ isCompiling: true, isRunning: false, rawError: '', errors: [] });
    const write = get().terminalWriteCallback;

    if (write) {
      write('\x1b[33m[Compiling...]\x1b[0m\r\n');
    }

    try {
      const response = await compileAndRun(code, stdin);
      
      set({ 
        isCompiling: false, 
        isRunning: true,
        executionTime: response.executionTime,
        rawError: response.error,
        errors: parseErrors(response.error)
      });

      if (write) {
        // Clear compilation message
        write('\x1b[2K\r');
        
        if (response.error) {
          write('\x1b[31m[Compilation Failed]\x1b[0m\r\n');
          // Write errors in red
          write(response.error.replace(/\n/g, '\r\n') + '\r\n');
          set({ isRunning: false, exitStatus: 1 });
        } else {
          write('\x1b[32m[Execution Succeeded]\x1b[0m\r\n');
          // Write standard output
          write(response.output.replace(/\n/g, '\r\n'));
          if (!response.output.endsWith('\n') && response.output.length > 0) {
            write('\r\n');
          }
          write(`\r\n\x1b[90m--------------------------------\r\nProcess exited with status 0 (0.00s)\x1b[0m\r\n`);
          set({ isRunning: false, exitStatus: 0 });
        }
      }
    } catch (err) {
      set({ isCompiling: false, isRunning: false, rawError: err.message, exitStatus: 1 });
      if (write) {
        write(`\r\n\x1b[31m[Error]: ${err.message}\x1b[0m\r\n`);
      }
    }
  }
}));
