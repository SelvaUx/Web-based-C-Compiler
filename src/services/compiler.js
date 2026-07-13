/**
 * Compiler Service
 * Handles compilation and execution of C code using public APIs.
 * Primary: CodeX API (CORS-enabled)
 * Fallback: Wandbox API via CORS Proxy
 */

// Helper to convert object to urlencoded string
const toUrlEncoded = (obj) => {
  return Object.keys(obj)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&');
};

// Circuit breaker variables
let isCodeXDown = false;
let codexDownTimer = 0;
const CODEX_TIMEOUT_MS = 1200; // 1.2 seconds timeout

/**
 * Execute C code using CodeX API
 * @param {string} code C source code
 * @param {string} input stdin input
 * @returns {Promise<{success: boolean, output: string, error: string, executionTime: number}>}
 */
const runWithCodeX = async (code, input) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CODEX_TIMEOUT_MS);

  const payload = {
    code: code,
    language: 'c',
    input: input || ''
  };

  try {
    const response = await fetch('https://api.codex.jaagrav.in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: toUrlEncoded(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`CodeX server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // CodeX output schema: { timeStamp, status, output, error, language, info }
    if (data.status !== 200 && !data.error) {
      return {
        success: false,
        output: '',
        error: data.output || 'Unknown compilation error',
        executionTime: 0
      };
    }

    return {
      success: !data.error,
      output: data.output || '',
      error: data.error || '',
      executionTime: 0 // CodeX doesn't specify execution time, we can measure it on client-side
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Execute C code using Wandbox API (via CORS Proxy as fallback)
 * @param {string} code C source code
 * @param {string} input stdin input
 * @returns {Promise<{success: boolean, output: string, error: string, executionTime: number}>}
 */
const runWithWandbox = async (code, input) => {
  const payload = {
    code: code,
    compiler: 'gcc-head-c',
    options: 'c11',
    stdin: input || '',
    'compiler-option-raw': '-O2\n-lm'
  };

  // Using corsproxy.io as a free proxy to bypass CORS
  const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://wandbox.org/api/compile.json');
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Wandbox proxy server responded with status: ${response.status}`);
  }

  const data = await response.json();
  
  // Wandbox schema includes fields: program_message, program_error, program_output, status, compiler_message
  const success = data.status === '0';
  const output = data.program_output || '';
  const error = data.compiler_message || data.program_error || '';

  return {
    success,
    output,
    error,
    executionTime: 0
  };
};

/**
 * Parse compilation error/warning message to extract lines and details
 * @param {string} rawError Raw compiler error string
 * @returns {Array<{line: number, column: number, type: 'error'|'warning', message: string}>}
 */
export const parseErrors = (rawError) => {
  if (!rawError) return [];
  const lines = rawError.split('\n');
  const parsed = [];

  // Match pattern: main.c:line:col: (error|warning): message
  const errorRegex = /(?:prog\.c|main\.c|\bcode\b):(\d+):(\d+):\s+(error|warning):\s+(.*)/i;

  lines.forEach(line => {
    const match = line.match(errorRegex);
    if (match) {
      parsed.push({
        line: parseInt(match[1], 10),
        column: parseInt(match[2], 10),
        type: match[3].toLowerCase() === 'warning' ? 'warning' : 'error',
        message: match[4].trim()
      });
    }
  });

  return parsed;
};

/**
 * Main Compile & Run function
 * Runs with CodeX, falls back to Wandbox on failure
 */
export const compileAndRun = async (code, input = '') => {
  const startTime = Date.now();
  const now = Date.now();
  const shouldSkipCodeX = isCodeXDown && now < codexDownTimer;
  
  if (!shouldSkipCodeX) {
    try {
      // Try CodeX first
      const result = await runWithCodeX(code, input);
      const endTime = Date.now();
      result.executionTime = (endTime - startTime) / 1000; // seconds
      
      // CodeX succeeded, reset status
      isCodeXDown = false;
      return result;
    } catch (codexError) {
      console.warn('CodeX compiler failed/timed out, setting circuit breaker and attempting Wandbox fallback...', codexError);
      
      // Flag CodeX down for 3 minutes
      isCodeXDown = true;
      codexDownTimer = Date.now() + 3 * 60 * 1000;
    }
  } else {
    console.info('CodeX is currently marked down, bypassing directly to Wandbox...');
  }
  
  // Wandbox fallback execution
  try {
    const result = await runWithWandbox(code, input);
    const endTime = Date.now();
    result.executionTime = (endTime - startTime) / 1000; // seconds
    return result;
  } catch (wandboxError) {
    console.error('All compilers failed:', wandboxError);
    return {
      success: false,
      output: '',
      error: `Compilation service temporarily unavailable.\n\nWandbox Error: ${wandboxError.message}`,
      executionTime: 0
    };
  }
};
