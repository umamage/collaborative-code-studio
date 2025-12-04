/**
 * Centralized API service for all backend calls.
 * Currently mocked - replace with real API calls when backend is ready.
 */

import { nanoid } from 'nanoid';

export interface Session {
  id: string;
  createdAt: Date;
  language: string;
  code: string;
  participants: Participant[];
}

export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: Date;
}

export interface CodeUpdate {
  sessionId: string;
  code: string;
  language: string;
  updatedBy: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

// In-memory mock storage
const sessions = new Map<string, Session>();

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  /**
   * Create a new interview session
   */
  async createSession(hostName: string, language: string = 'javascript'): Promise<Session> {
    await delay(300);
    
    const session: Session = {
      id: nanoid(10),
      createdAt: new Date(),
      language,
      code: getDefaultCode(language),
      participants: [{
        id: nanoid(8),
        name: hostName,
        isHost: true,
        joinedAt: new Date(),
      }],
    };
    
    sessions.set(session.id, session);
    return session;
  },

  /**
   * Join an existing session
   */
  async joinSession(sessionId: string, participantName: string): Promise<Session | null> {
    await delay(200);
    
    const session = sessions.get(sessionId);
    if (!session) {
      // Create a mock session for demo purposes
      const mockSession: Session = {
        id: sessionId,
        createdAt: new Date(),
        language: 'javascript',
        code: getDefaultCode('javascript'),
        participants: [],
      };
      sessions.set(sessionId, mockSession);
    }
    
    const currentSession = sessions.get(sessionId)!;
    currentSession.participants.push({
      id: nanoid(8),
      name: participantName,
      isHost: false,
      joinedAt: new Date(),
    });
    
    return currentSession;
  },

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    await delay(100);
    return sessions.get(sessionId) || null;
  },

  /**
   * Update code in session
   */
  async updateCode(update: CodeUpdate): Promise<void> {
    await delay(50);
    
    const session = sessions.get(update.sessionId);
    if (session) {
      session.code = update.code;
      session.language = update.language;
    }
  },

  /**
   * Execute code safely
   */
  async executeCode(code: string, language: string): Promise<ExecutionResult> {
    await delay(500);
    
    const startTime = performance.now();
    
    if (language === 'javascript') {
      try {
        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };
        
        // Execute in a try-catch
        const result = eval(code);
        console.log = originalLog;
        
        const output = logs.length > 0 
          ? logs.join('\n') 
          : result !== undefined 
            ? String(result) 
            : 'Code executed successfully (no output)';
        
        return {
          success: true,
          output,
          executionTime: performance.now() - startTime,
        };
      } catch (error: any) {
        return {
          success: false,
          output: '',
          error: error.message,
          executionTime: performance.now() - startTime,
        };
      }
    }
    
    // Mock execution for other languages
    return {
      success: true,
      output: `[Mock] Code execution for ${language} is simulated.\nYour code would run on a secure backend server.`,
      executionTime: performance.now() - startTime,
    };
  },

  /**
   * Subscribe to real-time updates (mocked with polling simulation)
   */
  subscribeToSession(sessionId: string, onUpdate: (session: Session) => void): () => void {
    // In a real implementation, this would be a WebSocket connection
    const interval = setInterval(() => {
      const session = sessions.get(sessionId);
      if (session) {
        onUpdate(session);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  },
};

function getDefaultCode(language: string): string {
  const templates: Record<string, string> = {
    javascript: `// Welcome to the coding interview!
// Write your solution below.

function solution(input) {
  // Your code here
  return input;
}

// Test your solution
console.log(solution("Hello, World!"));
`,
    typescript: `// Welcome to the coding interview!
// Write your solution below.

function solution(input: string): string {
  // Your code here
  return input;
}

// Test your solution
console.log(solution("Hello, World!"));
`,
    python: `# Welcome to the coding interview!
# Write your solution below.

def solution(input):
    # Your code here
    return input

# Test your solution
print(solution("Hello, World!"))
`,
    java: `// Welcome to the coding interview!
// Write your solution below.

public class Solution {
    public static String solution(String input) {
        // Your code here
        return input;
    }
    
    public static void main(String[] args) {
        System.out.println(solution("Hello, World!"));
    }
}
`,
    cpp: `// Welcome to the coding interview!
// Write your solution below.

#include <iostream>
#include <string>
using namespace std;

string solution(string input) {
    // Your code here
    return input;
}

int main() {
    cout << solution("Hello, World!") << endl;
    return 0;
}
`,
  };
  
  return templates[language] || templates.javascript;
}

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: '.js' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts' },
  { id: 'python', name: 'Python', extension: '.py' },
  { id: 'java', name: 'Java', extension: '.java' },
  { id: 'cpp', name: 'C++', extension: '.cpp' },
];
