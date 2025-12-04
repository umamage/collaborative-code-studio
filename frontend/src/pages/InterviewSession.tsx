import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Play, RotateCcw } from 'lucide-react';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { LanguageSelector } from '@/components/LanguageSelector';
import { OutputPanel } from '@/components/OutputPanel';
import { ShareDialog } from '@/components/ShareDialog';
import { Button } from '@/components/ui/button';
import { api, SUPPORTED_LANGUAGES, type Session, type ExecutionResult } from '@/services/api';
import { executor } from '@/services/executor';
import { toast } from 'sonner';

export default function InterviewSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ... (existing useEffects)

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRun = async () => {
    setIsExecuting(true);
    setResult(null);
    try {
      // Use client-side executor
      const execResult = await executor.executeCode(code, language, input);
      setResult(execResult);
    } catch (error) {
      toast.error('Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    api.createSession('temp', language).then((s) => {
      setCode(s.code);
      setResult(null);
      toast.success('Code reset to template');
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Loading session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        sessionId={sessionId}
        participantCount={session?.participants.length || 1}
      />

      {/* Toolbar */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-card/30">
        <div className="flex items-center gap-3">
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            variant="glow"
            size="sm"
            onClick={handleRun}
            disabled={isExecuting}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? 'Running...' : 'Run Code'}
          </Button>
          {sessionId && <ShareDialog sessionId={sessionId} />}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 p-4">
          <CodeEditor
            value={code}
            language={language}
            onChange={handleCodeChange}
          />
        </div>

        {/* Output Panel */}
        <div className="w-96 p-4 pl-0">
          <OutputPanel
            result={result}
            isExecuting={isExecuting}
            input={input}
            onInputChange={setInput}
          />
        </div>
      </div>
    </div>
  );
}
