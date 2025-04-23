// src/components/layout/PageHeader.tsx
"use client";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";

export function PageHeader() {
    const { session, supabase } = useSupabase();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth');
    };

    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Notes</h1>
            <div className="flex items-center gap-4">
                <ThemeToggle />

                {session && (
                    <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                )}
            </div>
        </div>
    );
}