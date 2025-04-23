// src/components/auth/SignInForm.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';


export function SignInForm() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        setIsLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) throw signInError;

        } catch (err: unknown) { 
            console.error("Error during Sign In:", err);
            let errorMessage = "An unexpected error occurred during sign in.";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                 errorMessage = err;
            }
            setError(errorMessage);
            toast.error(`Sign In Failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignIn} className="space-y-4">
      
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input
                    id="email-signin"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input
                    id="password-signin"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <Button
                type="submit" 
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
            </Button>
          
        </form>
    );
}