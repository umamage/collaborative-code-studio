import { ExecutionResult } from './api';

// Type definition for Pyodide
declare global {
    interface Window {
        loadPyodide: any;
    }
}

let pyodide: any = null;

export const executor = {
    async executeCode(code: string, language: string): Promise<ExecutionResult> {
        const startTime = performance.now();

        try {
            let output = '';

            if (language === 'javascript') {
                output = await executeJavaScript(code);
            } else if (language === 'python') {
                output = await executePython(code);
            } else {
                return {
                    success: false,
                    output: '',
                    error: `Client-side execution for ${language} is not supported yet.`,
                    executionTime: 0,
                };
            }

            return {
                success: true,
                output,
                executionTime: performance.now() - startTime,
            };
        } catch (error: any) {
            return {
                success: false,
                output: '',
                error: error.message || String(error),
                executionTime: performance.now() - startTime,
            };
        }
    },
};

function executeJavaScript(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const workerCode = `
      self.onmessage = function(e) {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };

        try {
          const result = eval(e.data);
          if (result !== undefined) {
            logs.push(String(result));
          }
          self.postMessage({ success: true, output: logs.join('\\n') });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      };
    `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        worker.onmessage = (e) => {
            if (e.data.success) {
                resolve(e.data.output);
            } else {
                reject(new Error(e.data.error));
            }
            worker.terminate();
        };

        worker.onerror = (error) => {
            reject(new Error(error.message));
            worker.terminate();
        };

        // Timeout after 5 seconds
        setTimeout(() => {
            worker.terminate();
            reject(new Error('Execution timed out (5s limit)'));
        }, 5000);

        worker.postMessage(code);
    });
}

async function executePython(code: string): Promise<string> {
    if (!pyodide) {
        if (!window.loadPyodide) {
            throw new Error('Pyodide is not loaded. Please refresh the page.');
        }
        pyodide = await window.loadPyodide();
    }

    // Redirect stdout
    pyodide.setStdout({ batched: (msg: string) => { /* captured in runPython */ } });

    try {
        // We use a custom capture method because setStdout is tricky with async
        await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);

        await pyodide.runPythonAsync(code);

        const output = await pyodide.runPythonAsync(`sys.stdout.getvalue()`);
        return output;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
