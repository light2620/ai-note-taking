// src/hooks/useUpdateNoteSummaryMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNoteSummary } from '@/lib/supabase/notes-api';
import type { Note } from '@/types/note';
import { useSupabase } from '@/components/providers/SupabaseProvider';

export const useUpdateNoteSummaryMutation = () => {
    const queryClient = useQueryClient();
    const { session } = useSupabase();

    return useMutation({
        mutationFn: ({ id, summary }: { id: number; summary: string }) => updateNoteSummary(id, summary),

        onSuccess: (updatedNote) => {
            console.log('Note summary saved successfully:', updatedNote);
            queryClient.setQueryData<Note[]>(
                ['notes', session?.user?.id],
                (oldData) =>
                    oldData?.map((note) =>
                        note.id === updatedNote.id ? updatedNote : note
                    ) ?? []
            );
        },

        onError: (error) => {
            console.error('Failed to save note summary:', error);
        },
    });
};