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
import { toast } from 'sonner';

export default function InterviewSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const loadSession = async () => {
      try {
        let existingSession = await api.getSession(sessionId);
        if (!existingSession) {
          // Create session on the fly for demo
          existingSession = await api.joinSession(sessionId, 'Guest');
        }
        if (existingSession) {
          setSession(existingSession);
          setCode(existingSession.code);
          setLanguage(existingSession.language);
        }
      } catch (error) {
        toast.error('Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Subscribe to real-time updates
    const unsubscribe = api.subscribeToSession(sessionId, (updatedSession) => {
      setSession(updatedSession);
      // Only update code if it changed from another user
      // In a real implementation, we'd use operational transforms or CRDTs
    });

    return unsubscribe;
  }, [sessionId]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (sessionId) {
      api.updateCode({
        sessionId,
        code: newCode,
        language,
        updatedBy: 'current-user',
      });
    }
  }, [sessionId, language]);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    const template = SUPPORTED_LANGUAGES.find(l => l.id === newLanguage);
    if (template) {
      // Get default code for new language
      api.createSession('temp', newLanguage).then((s) => {
        setCode(s.code);
        if (sessionId) {
          api.updateCode({
            sessionId,
            code: s.code,
            language: newLanguage,
            updatedBy: 'current-user',
          });
        }
      });
    }
  }, [sessionId]);

  const handleRun = async () => {
    setIsExecuting(true);
    setResult(null);
    try {
      const execResult = await api.executeCode(code, language);
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
          <OutputPanel result={result} isExecuting={isExecuting} />
        </div>
      </div>
    </div>
  );
}
