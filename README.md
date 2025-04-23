# AI Mini Notes App

A simple, responsive notes application built with Next.js, Supabase, Shadcn UI, and integrated AI summarisation capabilities using the Groq API. This project fulfils the requirements of the AI-Powered Notes App assignment.

**Live Demo:* https://your-app-name.vercel.app](https://ai-note-taking-ten.vercel.app/ 🔗
**Summarise button only works for descriptions greater than 50 words**

## Features

*   **User Authentication:**
    *   Sign Up with Email & Password
    *   Sign In with Email & Password
    *   Sign In with Google (OAuth)
    *   Custom authentication forms built with Shadcn UI.
*   **Note Management (CRUD):**
    *   Create new notes with a title and content.
    *   View a list of existing notes.
    *   Edit existing notes within a sheet component.
    *   Delete notes with confirmation.
*   **AI Summarization:**
    *   Generate concise summaries (2-3 sentences) of note content using the Groq API (Llama 3 8b model).
    *   Display summaries on note cards with a "Read More/Less" toggle.
    *   The button is disabled with an informative tooltip for notes with insufficient content.
*   **UI/UX:**
    *   Clean, intuitive interface built with Shadcn UI components.
    *   Responsive design adapting to different screen sizes.
    *   Light/Dark mode theme toggle.
    *   Loading states and user feedback via toasts (Sonner).
*   **State Management:**
    *   Efficient data fetching, caching, and state management using TanStack Query (React Query).
    *   Automatic UI updates after mutations (create, update, delete, summarise) via query invalidation and optimistic updates.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (v14+ with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Backend & Database:** [Supabase](https://supabase.com/) (Authentication, Postgres Database, RLS)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** [TanStack Query (React Query) v5](https://tanstack.com/query/latest)
*   **AI Summarization API:** [Groq](https://groq.com/) (via `groq-sdk`)
*   **Forms:** Custom forms using Shadcn components
*   **Toasts/Notifications:** [Sonner](https://sonner.emilkowal.ski/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Deployment:** [Vercel](https://vercel.com/)
