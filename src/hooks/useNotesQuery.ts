// src/hooks/useNotesQuery.ts
import { useQuery } from '@tanstack/react-query';
import { getNotes } from '@/lib/supabase/notes-api';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Note } from '@/types/note';

export const useNotesQuery = () => {
  const { session } = useSupabase();


  return useQuery<Note[], Error>({
    queryKey: ['notes', session?.user?.id],
    queryFn: getNotes,
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};