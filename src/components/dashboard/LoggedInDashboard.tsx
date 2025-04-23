// src/components/dashboard/LoggedInDashboard.tsx
"use client";

import React from 'react'; // Need React for useState
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NoteList } from "@/components/notes/NoteList";
import { NoteForm } from "@/components/notes/NoteForm";

export function LoggedInDashboard() {
    const { session } = useSupabase();

    const [isCreateNoteOpen, setIsCreateNoteOpen] = React.useState(false);

    if (!session) return null;

    return (
        <div className="space-y-6">
        
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Welcome back, {session.user?.email || 'User'}!</p>
                <Dialog open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">Create New Note</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Note</DialogTitle>
                            <DialogDescription>
                                Fill in the details for your new note. Click 'Create Note' when done.
                            </DialogDescription>
                        </DialogHeader>
                
                        <NoteForm onSuccess={() => setIsCreateNoteOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

      
            <NoteList />
        </div>
    );
}