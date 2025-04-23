// src/hooks/useCreateNoteMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/supabase/notes-api';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Note } from '@/types/note';

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();
  const { session } = useSupabase();

  return useMutation({

    mutationFn: createNote,


    onSuccess: (newNote) => {
      console.log('Note created successfully:', newNote);

      queryClient.invalidateQueries({
         queryKey: ['notes', session?.user?.id]
      });
    },


    onError: (error) => {
      console.error('Failed to create note:', error);

    },
  });
};