import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const languageMap: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
};

export function CodeEditor({ value, language, onChange, readOnly = false }: CodeEditorProps) {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border bg-editor">
      <Editor
        height="100%"
        language={languageMap[language] || 'javascript'}
        value={value}
        onChange={(val) => onChange(val || '')}
        theme="vs-dark"
        loading={
          <div className="flex items-center justify-center h-full bg-editor">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        }
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: false },
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          readOnly,
        }}
      />
    </div>
  );
}
