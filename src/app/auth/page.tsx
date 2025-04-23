// src/app/auth/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { SignInForm, SignUpForm, SocialSignIn } from '@/components/auth';

export default function AuthPage() {
    const supabase = createClient();
    const router = useRouter();
    const { session } = useSupabase();
    const [message, setMessage] = useState<string | null>(null);


    useEffect(() => {
        if (session) {
            router.replace('/');
        }
    }, [session, router]);


    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
            if (event === 'SIGNED_IN' && currentSession) {
               
                if (!session) {
                   toast.success("Successfully signed in!");
                   router.push('/');
                   setTimeout(() => router.refresh(), 100);
                }
            }
             if (event === 'PASSWORD_RECOVERY') {
                setMessage("Password recovery email sent. Check your inbox.");
            }
             
        });
        return () => {
            subscription?.unsubscribe();
        };
    }, [supabase, router, session]); 


    if (session) {
       
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen px-4 py-8 bg-background">
            <Card className="w-full max-w-md shadow-lg">
                <Tabs defaultValue="signin" className="w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome!</CardTitle>
                        <CardDescription>
                           Sign in or create an account to continue.
                        </CardDescription>
                    
                        <TabsList className="grid w-full grid-cols-2 mt-4">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                    </CardHeader>

            
                    <TabsContent value="signin">
                        <CardContent>
                           
                            {message && (
                                <Alert variant="default" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Info</AlertTitle>
                                    <AlertDescription>{message}</AlertDescription>
                                </Alert>
                             )}
                            <SignInForm />
                        </CardContent>
                        <CardFooter>

                        </CardFooter>
                    </TabsContent>


                    <TabsContent value="signup">
                        <CardContent>

                             {message && (
                                <Alert variant="default" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Info</AlertTitle>
                                    <AlertDescription>{message}</AlertDescription>
                                </Alert>
                             )}
                            <SignUpForm onSuccessMessage={setMessage} />
                        </CardContent>
                        <CardFooter>
                        </CardFooter>
                    </TabsContent>
                </Tabs>


                 <div className="relative my-4 px-8">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="px-8 pb-8">
                     <SocialSignIn />
                </div>

            </Card>
        </div>
    );
}