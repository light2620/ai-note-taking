
"use client"; 

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoggedOutLanding() {
    return (
        <div className="text-center mt-16 space-y-4">
            <h2 className="text-xl font-semibold">Access Your Notes</h2>
            <p className="text-muted-foreground">Please log in or sign up to create and manage your notes.</p>
            <Button asChild size="lg">
                <Link href="/auth">Login / Sign Up</Link>
            </Button>
        </div>
    );
}