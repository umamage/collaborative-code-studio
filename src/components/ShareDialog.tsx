import { useState } from 'react';
import { Copy, Check, Link } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareDialogProps {
  sessionId: string;
}

export function ShareDialog({ sessionId }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/session/${sessionId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Link className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Share Interview Session</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share this link with candidates to join the interview.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 px-3 py-2 rounded-md bg-secondary border border-border font-mono text-sm text-foreground truncate">
            {shareUrl}
          </div>
          <Button onClick={handleCopy} variant="glow" size="icon">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
