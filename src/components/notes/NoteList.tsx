// src/components/notes/NoteList.tsx
"use client";

import React, { useState } from 'react';
import { useNotesQuery } from '@/hooks/useNotesQuery';
import { useDeleteNoteMutation } from '@/hooks/useDeleteNoteMutation';
import { useSummarizeMutation } from '@/hooks/useSummarizeMutation';
import { useUpdateNoteSummaryMutation } from '@/hooks/useUpdateNoteSummaryMutation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { NoteForm } from './NoteForm';
import type { Note } from '@/types/note';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    MoreVertical,
    Trash2,
    Edit,
    FileText,
    Loader2,
    ChevronDown, 
    ChevronUp    
} from 'lucide-react';


const MIN_CONTENT_LENGTH_FOR_SUMMARY = 50;
const SUMMARY_LINE_CLAMP = 'line-clamp-3'; 

export function NoteList() {

  const { data: notes, isLoading, isError, error } = useNotesQuery();
  const deleteNoteMutation = useDeleteNoteMutation();
  const summarizeMutation = useSummarizeMutation();
  const saveSummaryMutation = useUpdateNoteSummaryMutation();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [summarizingNoteId, setSummarizingNoteId] = useState<number | null>(null);
  const [expandedSummaries, setExpandedSummaries] = useState<Record<number, boolean>>({}); 



  const toggleSummaryExpansion = (noteId: number) => {
    setExpandedSummaries(prev => ({
      ...prev,
      [noteId]: !prev[noteId] 
    }));
  };

  // Handle deleting a note
  const handleDelete = async (id: number) => {
    try {
      await deleteNoteMutation.mutateAsync(id);
      toast.success("Note deleted successfully!");
    } catch (err) {
      console.error("Delete error caught in component:", err);
    }
  };


  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingNote(null);
  };


  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setIsSheetOpen(true);
  };


  const handleSummarize = async (note: Note) => {
     const trimmedContent = note.content?.trim() ?? "";
     if (trimmedContent.length < MIN_CONTENT_LENGTH_FOR_SUMMARY) {

         toast.error("Cannot summarize.", { description: `Note content must be at least ${MIN_CONTENT_LENGTH_FOR_SUMMARY} characters.` });
         return;
     }
     if (summarizeMutation.isPending || saveSummaryMutation.isPending || summarizingNoteId !== null) {
         toast.info("Summarization is already in progress.");
         return;
     }

     setSummarizingNoteId(note.id);

     try {
         console.log(`[handleSummarize] Requesting summary for note ID: ${note.id}`);
         const { summary } = await summarizeMutation.mutateAsync({ content: trimmedContent });
         console.log(`[handleSummarize] Summary received for note ID: ${note.id}`);

         await saveSummaryMutation.mutateAsync({ id: note.id, summary });
         console.log(`[handleSummarize] Summary saved for note ID: ${note.id}`);

         setExpandedSummaries(prev => ({ ...prev, [note.id]: true }));

         toast.success(`Summary generated and saved for note "${note.title || 'Untitled Note'}"!`);
     }  catch (error: unknown) { // Change 'any' to 'unknown'
        console.error(`[handleSummarize] Error for note ID ${note.id}:`, error);
        let errorMessage = "Failed to get or save summary";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
             errorMessage = error;
        }
        toast.error(`Error: ${errorMessage}`); // Use parsed message
    } finally {
        setSummarizingNoteId(null);
    }
  };



  if (isLoading) {
  
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
    
          <Card key={`skeleton-${i}`} className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </div>
            <CardFooter className="flex justify-between items-center">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
 
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Notes</AlertTitle>
            <AlertDescription>
                Failed to load notes: {error instanceof Error ? error.message : 'Unknown error'}
            </AlertDescription>
        </Alert>
    );
}

  if (!notes || notes.length === 0) {
    
     return <p className="text-center text-muted-foreground mt-8">No notes found. Create your first note!</p>;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => {
      
          const isSummarizing = summarizingNoteId === note.id;
          const trimmedContentLength = note.content?.trim().length ?? 0;
          const hasContent = trimmedContentLength > 0;
          const hasEnoughContent = hasContent && trimmedContentLength >= MIN_CONTENT_LENGTH_FOR_SUMMARY;
          const isSummaryExpanded = expandedSummaries[note.id] || false; // Default to false if not set

     
          let summarizeButtonTooltip = "";
          if (isSummarizing) {
              summarizeButtonTooltip = "Summarization in progress...";
          } else if (!hasContent) {
              summarizeButtonTooltip = "Cannot summarize an empty note.";
          } else if (!hasEnoughContent) {
              summarizeButtonTooltip = `Note content must be at least ${MIN_CONTENT_LENGTH_FOR_SUMMARY} characters to summarize. Current length: ${trimmedContentLength}.`;
          } else if (note.summary) {
              summarizeButtonTooltip = 'Generate a new summary (Re-Summarize)';
          } else {
              summarizeButtonTooltip = 'Generate summary';
          }
          const isSummarizeButtonDisabled = isSummarizing || !hasEnoughContent;

          return (
            <Card key={note.id} className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
              <div> 
                <CardHeader>
                  <CardTitle className="flex justify-between items-start gap-2">
                    <span className="break-words flex-1">{note.title || 'Untitled Note'}</span>
                 
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" disabled={isSummarizing}>
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Note actions for {note.title || 'Untitled Note'}</span>
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleEditClick(note)} disabled={isSummarizing}>
                            <Edit className="mr-2 h-4 w-4" /><span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={(e)=> e.preventDefault()} disabled={isSummarizing}>
                               <Trash2 className="mr-2 h-4 w-4" /><span>Delete</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                
                      <AlertDialogContent>
                         <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete {note.title || 'Untitled Note'}.</AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteNoteMutation.isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(note.id)} disabled={deleteNoteMutation.isPending} className="bg-destructive hover:bg-destructive/90">
                               {deleteNoteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Delete
                            </AlertDialogAction>
                         </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardTitle>
                  <CardDescription>
                    Created: {new Date(note.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow pb-4"> 
               
                  <p className="text-sm line-clamp-4 whitespace-pre-wrap">
                    {note.content || <span className="text-muted-foreground italic">No content</span>}
                  </p>

    
                  {note.summary && (
                    <div className="border-t pt-3 mt-3 space-y-1.5"> 
                      <h4 className="text-xs font-semibold text-primary/90 uppercase tracking-wider">Summary</h4>
                
                      <p className={cn(
                          "text-sm text-muted-foreground italic whitespace-pre-wrap",
                          !isSummaryExpanded && SUMMARY_LINE_CLAMP 
                       )}>
                        {note.summary}
                      </p>
                     
                       <Button
                           variant="link"
                           size="sm"
                           onClick={() => toggleSummaryExpansion(note.id)}
                           className="text-xs h-auto p-0 text-primary/80 hover:text-primary"
                       >
                          {isSummaryExpanded ? (
                            <><ChevronUp className="h-3 w-3 mr-1"/> Read Less</>
                          ) : (
                            <><ChevronDown className="h-3 w-3 mr-1"/> Read More</>
                          )}
                       </Button>
                    </div>
                  )}
                </CardContent>
              </div>
    
              <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t">
                 <span>ID: {note.id}</span>
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSummarize(note)}
                    disabled={isSummarizeButtonDisabled}
                    title={summarizeButtonTooltip}
                    className="gap-1" 
                 >
                     {isSummarizing ? (
                       <Loader2 className="h-3.5 w-3.5 animate-spin" />
                     ) : (
                       <FileText className="h-3.5 w-3.5" />
                     )}
                    <span className='text-xs'>
                       {isSummarizing ? 'Summarizing...' : (note.summary ? 'Re-Sum.' : 'Summarize')} {/* Abbreviated Re-Summarize */}
                    </span>
                 </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>


      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent onInteractOutside={closeSheet} onEscapeKeyDown={closeSheet} className="sm:max-w-lg w-[90vw]">
              <SheetHeader>
                  <SheetTitle>Edit Note</SheetTitle>
                  <SheetDescription>Make changes to your note. Click Save Changes when done.</SheetDescription>
              </SheetHeader>
              {editingNote && <NoteForm initialData={editingNote} onSuccess={closeSheet} />}
          </SheetContent>
      </Sheet>
    </>
  );
}