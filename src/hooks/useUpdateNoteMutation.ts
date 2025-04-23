// src/hooks/useUpdateNoteMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNote, type UpdateNoteData } from '@/lib/supabase/notes-api';
import { useSupabase } from '@/components/providers/SupabaseProvider';

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();
  const { session } = useSupabase();

  return useMutation({
    mutationFn: ({ id, noteData }: { id: number; noteData: UpdateNoteData }) => updateNote(id, noteData),

    onSuccess: (updatedNote) => {
      console.log('Note updated successfully:', updatedNote);

      queryClient.invalidateQueries({
        queryKey: ['notes', session?.user?.id]
      });

    },

    onError: (error) => {
      console.error('Failed to update note:', error);

    },
  });
};