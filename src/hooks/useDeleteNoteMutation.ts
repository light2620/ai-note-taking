// src/hooks/useDeleteNoteMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/supabase/notes-api';
import type { Note } from '@/types/note';
import { useSupabase } from '@/components/providers/SupabaseProvider';

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();
  const { session } = useSupabase();

  return useMutation({
    mutationFn: deleteNote,


    onMutate: async (deletedNoteId) => {

       await queryClient.cancelQueries({ queryKey: ['notes', session?.user?.id] });
       const previousNotes = queryClient.getQueryData<Note[]>(['notes', session?.user?.id]);


       queryClient.setQueryData<Note[]>(
         ['notes', session?.user?.id],
         (oldData) => oldData?.filter((note) => note.id !== deletedNoteId) ?? []
       );
       return { previousNotes };
    },
    onError: (err, deletedNoteId, context) => {
        console.error('Failed to delete note:', err);
        if (context?.previousNotes) {
            queryClient.setQueryData(['notes', session?.user?.id], context.previousNotes);
        }
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['notes', session?.user?.id] });
    },
  });
};