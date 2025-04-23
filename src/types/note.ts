
export type Note = {
    id: number;
    created_at: string;
    user_id: string; 
    title: string | null;
    content: string | null;
    summary: string | null;
  };