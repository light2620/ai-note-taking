// src/components/notes/NoteForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useCreateNoteMutation } from '@/hooks/useCreateNoteMutation';
import { useUpdateNoteMutation } from '@/hooks/useUpdateNoteMutation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Note } from '@/types/note';

interface NoteFormProps {
  initialData?: Note | null;
  onSuccess?: () => void;
}

export function NoteForm({ initialData = null, onSuccess }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialData]);

  const isEditing = !!initialData;
  const mutation = isEditing ? updateNoteMutation : createNoteMutation;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim()) {
      toast.error("Note content cannot be empty.");
      return;
    }

    const noteData = {
      title: title.trim() || null, 
      content: content.trim(),
    };

    console.log(`Submitting note data (${isEditing ? 'Update' : 'Create'}):`, noteData);
    if (isEditing) {
       console.log(`Updating note ID: ${initialData?.id}`);
    }

    try {
      if (isEditing && initialData) {
        await updateNoteMutation.mutateAsync({ id: initialData.id, noteData });
        toast.success("Note updated successfully!");
      } else {
        await createNoteMutation.mutateAsync(noteData);
        toast.success("Note created successfully!");
      }
      if (!isEditing) {
        setTitle('');
        setContent('');
      }
      onSuccess?.();
    } catch (error) {
  
      console.error(`Error during note ${isEditing ? 'update' : 'create'} in form submit:`, error);

    }
  };

  return (

    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
     
      <div className="space-y-2">
        <Label htmlFor="title">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Optional title"
          disabled={mutation.isPending}
        />
      </div>

  
      <div className="space-y-2"> 
        <Label htmlFor="content">
          Content
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px]" 
          placeholder="Your note content..."
          required
          disabled={mutation.isPending}
        />
      </div>

    
      <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Note')}
          </Button>
      </div>
    </form>
  );
}