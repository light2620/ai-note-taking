// src/lib/supabase/notes-api.ts
import { createClient } from './client';
import type { Note } from '@/types/note';

const supabase = createClient();

export type UpdateNoteData = {
    title?: string | null;
    content?: string | null;
};


export const getNotes = async (): Promise<Note[]> => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) throw sessionError || new Error('User not authenticated');
    const userId = session.user.id;
    const { data, error } = await supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};


export const createNote = async (noteData: Omit<Note, 'id' | 'created_at' | 'summary' | 'user_id'>): Promise<Note> => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) throw sessionError || new Error('User not authenticated');
    const userId = session.user.id;
    const noteToInsert = { ...noteData, user_id: userId };
    const { data, error } = await supabase.from('notes').insert(noteToInsert).select().single();
    if (error) throw error;
    if (!data) throw new Error('Failed to create note, no data returned.');
    return data;
};


export const updateNote = async (id: number, noteData: UpdateNoteData): Promise<Note> => {
    // Get current user session first (important for RLS check implicitly)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
        console.error('Error getting session or no user:', sessionError);
        throw sessionError || new Error('User not authenticated');
    }
    // Note: RLS policy handles ensuring user owns the note 'id' being updated

    const { data, error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', id) // Specify which note to update
        // .eq('user_id', session.user.id) // RLS handles this, but adding it doesn't hurt
        .select() // Return the updated row
        .single(); // Expecting a single row back

    if (error) {
        console.error('Error updating note:', error);
        throw error;
    }
    if (!data) {
        throw new Error('Failed to update note, no data returned.');
    }

    return data;
};

export const deleteNote = async (id: number): Promise<void> => {
    // Get current user session first (important for RLS check implicitly)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
        console.error('Error getting session or no user:', sessionError);
        throw sessionError || new Error('User not authenticated');
    }
    // Note: RLS policy handles ensuring user owns the note 'id' being deleted

    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id); // Specify which note to delete
        // .eq('user_id', session.user.id); // RLS handles this

    if (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
    // No data is returned on successful delete
};

export const updateNoteSummary = async (id: number, summary: string): Promise<Note> => {
    // Authentication check (important for RLS)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
        console.error('Error getting session or no user:', sessionError);
        throw sessionError || new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('notes')
        .update({ summary: summary }) // Update only the summary field
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating note summary:', error);
        throw error;
    }
    if (!data) {
        throw new Error('Failed to update note summary, no data returned.');
    }
    console.log(`[updateNoteSummary API] Summary updated for note ID: ${id}`);
    return data;
};