import { Code2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  sessionId?: string;
  participantCount?: number;
}

export function Header({ sessionId, participantCount }: HeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 justify-between">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <span className="font-semibold text-foreground">CodeInterview</span>
      </Link>
      
      {sessionId && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{participantCount || 1} connected</span>
          </div>
          <div className="px-3 py-1.5 rounded-md bg-secondary text-xs font-mono text-muted-foreground">
            Session: {sessionId}
          </div>
        </div>
      )}
    </header>
  );
}
