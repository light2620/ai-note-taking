// src/components/auth/SocialSignIn.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Loader2, ChromeIcon } from 'lucide-react'; 

export function SocialSignIn() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);


    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (oauthError) throw oauthError;
            
        } catch (err: unknown) {
            console.error("Error during Google Sign-In initiation:", err);
            let errorMessage = 'Could not initiate sign in.';
             if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            toast.error(`Google Sign-In Failed: ${errorMessage}`);
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <ChromeIcon className="mr-2 h-4 w-4" />
            )}
            Google
        </Button>
    );
}