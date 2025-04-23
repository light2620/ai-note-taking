Implementation Explanation
This section provides a brief overview of the technical implementation and architectural choices made during the development of the AI Mini Notes App.

**Note**
Only descriptions with above 50 characters summarise button works


1. Architecture & Project Structure:
The application utilises the Next.js App Router, leveraging its convention-based routing for UI pages (e.g., /, /auth) and server-side API endpoints (/api/summarize).
Code is structured into logical folders within src/:
app/: Core routing, layouts, pages, and API Route Handlers.
components/: Reusable React components, further organised by feature (e.g., auth, notes, layout, providers). ui/ contains the generated Shadcn components.
hooks/: Custom React Query hooks for data fetching and mutations.
lib/: Utility functions, Supabase client setup, and database interaction logic (notes-api.ts).
types/: Shared TypeScript type definitions.
TypeScript is used throughout the project for type safety and improved maintainability.

3. Frontend & UI (Next.js, Shadcn, Tailwind):
Shadcn UI components were used extensively to build a clean, consistent, and accessible user interface rapidly. Components were added via the Shadcn CLI.
Tailwind CSS provides the utility classes for styling, working seamlessly with Shadcn.
Responsiveness was considered, leveraging Tailwind's responsive prefixes to ensure usability across different screen sizes.
Custom Authentication UI: Instead of the default @supabase/auth-ui-react, custom forms were built using Shadcn components (Card, Tabs, Input, Button, Alert) within the /auth page (SignInForm.tsx, SignUpForm.tsx). This provides complete control over the UI/UX, ensuring visual consistency with the rest of the application.
Theme Switching: next-themes is integrated via a ThemeProvider for light/dark mode support.
User Feedback: Loading states (spinners), disabled elements, and toast notifications (using Sonner) are implemented to provide clear feedback during operations.
4. State Management (React Query):
TanStack Query (React Query) v5 is the core library for managing server state (data fetched from Supabase).
useQuery (useNotesQuery): Used for fetching the list of notes. It handles caching (gcTime, staleTime), background refetching, and provides loading/error states automatically. The queryKey includes the userId to ensure data isolation and automatic refetching on user change.
useMutation (e.g., useCreateNoteMutation, useDeleteNoteMutation, etc.): Used for all data modification operations (Create, Update, Delete notes; generating and saving summaries).
Cache Invalidation & Updates: Mutations leverage queryClient.invalidateQueries to automatically trigger refetches of the notes list after changes, ensuring the UI stays synchronized. Direct cache updates (queryClient.setQueryData) and optimistic updates (for delete) were implemented for a smoother user experience.
QueryProvider: Wraps the application in layout.tsx to provide the QueryClient instance globally.
5. Backend Integration (Supabase):
Authentication: Supabase Auth handles user registration, login (email/password, Google OAuth), password reset, and session management.
SupabaseProvider: Manages the session state application-wide by listening to onAuthStateChange.
Auth Callback (/auth/callback/route.ts): A crucial server-side Route Handler using @supabase/ssr handles the secure exchange of codes for sessions, particularly for OAuth and email link verification.
Database: A PostgreSQL database stores users (managed by Supabase Auth) and notes.
Data Access: All database interactions are encapsulated within async functions in lib/supabase/notes-api.ts.
Row Level Security (RLS): Policies are enabled and configured on the notes table to ensure users can only access and modify their own data, enforced at the database level.

6. AI Summarization (Groq API):
Problem-Solving Approach: To securely integrate the AI feature:
A dedicated server-side API route (/api/summarize/route.ts) was created within Next.js.
This route receives the note content from the client, securely accesses the GROQ_API_KEY from server-side environment variables, and calls the Groq API using the groq-sdk.
The client-side (NoteList.tsx) triggers this internal API route using a React Query mutation (useSummarizeMutation).
Upon receiving the summary, another mutation (useUpdateNoteSummaryMutation) saves it back to the specific note in the Supabase database.
UI Integration: The summary is displayed on the note card, with a "Read More/Less" toggle for longer summaries and user-friendly disabling of the summarize button for short notes (with an informative tooltip).
