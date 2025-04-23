// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider"; 
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils"; 
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Notes App",
  description: "Create and summarize your notes with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className 
      )}>

        <SupabaseProvider>
        <QueryProvider>

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

            <main className="container mx-auto px-4 py-8">
              {children} 
            </main>
          </ThemeProvider>
        </QueryProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}