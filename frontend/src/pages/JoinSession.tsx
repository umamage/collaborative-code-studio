import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { toast } from 'sonner';

export default function JoinSession() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [sessionExists, setSessionExists] = useState(false);

    // Validate session exists on mount
    useEffect(() => {
        const validateSession = async () => {
            if (!sessionId) {
                toast.error('Invalid session link');
                navigate('/');
                return;
            }

            try {
                const session = await api.getSession(sessionId);
                if (session) {
                    setSessionExists(true);
                } else {
                    toast.error('Session not found');
                    navigate('/');
                }
            } catch (error) {
                toast.error('Failed to load session');
                navigate('/');
            } finally {
                setIsValidating(false);
            }
        };

        validateSession();
    }, [sessionId, navigate]);

    const handleJoin = async () => {
        if (!name.trim()) {
            toast.error('Please enter your name');
            return;
        }

        if (!sessionId) return;

        setIsJoining(true);
        try {
            const session = await api.joinSession(sessionId, name.trim());
            if (session) {
                toast.success('Joined session!');
                // Store participant info in localStorage for verification
                localStorage.setItem(`session_${sessionId}_participant`, name.trim());
                navigate(`/session/${sessionId}/code`);
            } else {
                toast.error('Failed to join session');
            }
        } catch (error) {
            toast.error('Failed to join session');
        } finally {
            setIsJoining(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleJoin();
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Validating session...</span>
                </div>
            </div>
        );
    }

    if (!sessionExists) {
        return null; // Will redirect in useEffect
    }

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

            {/* Main Content */}
            <main className="container mx-auto px-4 py-20">
                <div className="max-w-md mx-auto">
                    <div className="p-8 rounded-2xl bg-card border border-border space-y-6 animate-fade-in">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold text-foreground">Join Coding Session</h1>
                            <p className="text-muted-foreground">
                                Enter your name to join the collaborative coding session
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-foreground">
                                    Your Name
                                </label>
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="bg-secondary border-border"
                                    autoFocus
                                />
                            </div>

                            <Button
                                onClick={handleJoin}
                                disabled={isJoining}
                                variant="glow"
                                size="lg"
                                className="w-full"
                            >
                                {isJoining ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        Join Session
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <p className="text-xs text-center text-muted-foreground">
                                Session ID: <span className="font-mono">{sessionId}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
