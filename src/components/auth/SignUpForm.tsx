// src/components/auth/SignUpForm.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';

interface SignUpFormProps {

    onSuccessMessage?: (message: string | null) => void;
}

export function SignUpForm({ onSuccessMessage }: SignUpFormProps) {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        onSuccessMessage?.(null); 

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {

                }
            });

            if (signUpError) throw signUpError;


            if (data.user && data.user.identities?.length === 0) {
                onSuccessMessage?.("Sign up successful! Check your email to verify your account.");
                toast.success("Sign up successful!", { description: "Please check your email for verification." });
                setEmail(''); 
                setPassword('');
            } else if (data.session) {
      
                toast.success("Sign up successful!");
 
            } else {
        
                onSuccessMessage?.("Sign up process initiated. If you already have an account, check your email or try signing in.");
                toast.info("Sign up process initiated.");
            }

        } catch (err: unknown) {
            console.error("Error during Sign Up:", err);
            let errorMessage = "An unexpected error occurred during sign up.";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            setError(errorMessage);
            toast.error(`Sign Up Failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignUp} className="space-y-4">

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                    id="email-signup"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                    id="password-signup"
                    type="password"
                    placeholder="Create a strong password"
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
                Sign Up
            </Button>
        </form>
    );
}