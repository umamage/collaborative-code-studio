import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, ArrowRight, Users, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    setIsCreating(true);
    try {
      const session = await api.createSession(name.trim());
      toast.success('Session created!');
      navigate(`/session/${session.id}`);
    } catch (error) {
      toast.error('Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!joinCode.trim()) {
      toast.error('Please enter a session code');
      return;
    }
    
    setIsJoining(true);
    try {
      const session = await api.joinSession(joinCode.trim(), name.trim());
      if (session) {
        toast.success('Joined session!');
        navigate(`/session/${session.id}`);
      } else {
        toast.error('Session not found');
      }
    } catch (error) {
      toast.error('Failed to join session');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-primary">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-semibold text-foreground">CodeInterview</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
            <Sparkles className="w-4 h-4" />
            Real-time collaborative coding
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Technical interviews,{' '}
            <span className="gradient-text">reimagined</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create instant coding sessions, share with candidates, and collaborate in real-time. 
            No setup required.
          </p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
            {/* Create Session Card */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground">Start Interview</h2>
              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary border-border"
                />
                <Button 
                  onClick={handleCreate} 
                  disabled={isCreating}
                  variant="glow"
                  size="lg"
                  className="w-full"
                >
                  {isCreating ? 'Creating...' : 'Create Session'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Join Session Card */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h2 className="text-lg font-semibold text-foreground">Join Session</h2>
              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary border-border"
                />
                <Input
                  placeholder="Session code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="bg-secondary border-border font-mono"
                />
                <Button 
                  onClick={handleJoin}
                  disabled={isJoining}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  {isJoining ? 'Joining...' : 'Join Session'}
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="p-6 rounded-xl bg-card/50 border border-border/50 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Real-time Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                See code changes instantly as candidates type. No refresh needed.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card/50 border border-border/50 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Instant Execution</h3>
              <p className="text-sm text-muted-foreground">
                Run code directly in the browser with immediate feedback.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card/50 border border-border/50 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Multiple Languages</h3>
              <p className="text-sm text-muted-foreground">
                Support for JavaScript, Python, TypeScript, Java, and C++.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
