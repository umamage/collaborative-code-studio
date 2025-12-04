/**
 * Centralized API service for all backend calls.
 * Currently mocked - replace with real API calls when backend is ready.
 */



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

const API_URL = 'http://localhost:8000';

export const api = {
  /**
   * Create a new interview session
   */
  async createSession(hostName: string, language: string = 'javascript'): Promise<Session> {
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostName, language }),
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    return response.json();
  },

  /**
   * Join an existing session
   */
  async joinSession(sessionId: string, participantName: string): Promise<Session | null> {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantName }),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to join session');
    }

    return response.json();
  },

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    const response = await fetch(`${API_URL}/sessions/${sessionId}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to get session');
    }

    return response.json();
  },

  /**
   * Update code in session
   */
  async updateCode(update: CodeUpdate): Promise<void> {
    const response = await fetch(`${API_URL}/sessions/${update.sessionId}/code`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      throw new Error('Failed to update code');
    }
  },

  /**
   * Execute code safely
   */
  async executeCode(code: string, language: string): Promise<ExecutionResult> {
    const response = await fetch(`${API_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute code');
    }

    return response.json();
  },

  /**
   * Subscribe to real-time updates (polling for now)
   */
  subscribeToSession(sessionId: string, onUpdate: (session: Session) => void): () => void {
    const interval = setInterval(async () => {
      try {
        const session = await this.getSession(sessionId);
        if (session) {
          onUpdate(session);
        }
      } catch (error) {
        console.error('Polling error:', error);
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
