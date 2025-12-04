import { CheckCircle2, XCircle, Clock, Terminal } from 'lucide-react';
import type { ExecutionResult } from '@/services/api';

interface OutputPanelProps {
  result: ExecutionResult | null;
  isExecuting: boolean;
}

export function OutputPanel({ result, isExecuting }: OutputPanelProps) {
  return (
    <div className="h-full flex flex-col rounded-lg border border-border bg-card overflow-hidden">
      <div className="h-10 px-4 flex items-center gap-2 border-b border-border bg-secondary/50">
        <Terminal className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Output</span>
        {result && (
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{result.executionTime.toFixed(0)}ms</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-auto font-mono text-sm">
        {isExecuting ? (
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse-subtle">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Executing...</span>
          </div>
        ) : result ? (
          <div className="space-y-2 animate-fade-in">
            {result.success ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <pre className="whitespace-pre-wrap text-foreground">{result.output}</pre>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <pre className="whitespace-pre-wrap text-destructive">{result.error}</pre>
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground">
            Click "Run Code" to execute your code
          </div>
        )}
      </div>
    </div>
  );
}
