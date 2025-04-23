
"use client"; 

import { useSupabase } from "@/components/providers/SupabaseProvider"; 
import { Loader2 } from 'lucide-react';

// Import the new layout/dashboard/landing components
import { PageHeader } from '@/components/layout/PageHeader';
import { LoggedInDashboard } from '@/components/dashboard/LoggedInDashboard';
import { LoggedOutLanding } from '@/components/landing/LoggedOutLanding';

export default function Home() {

  const { session, isLoading: isSessionLoading } = useSupabase();


  if (isSessionLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div>
      <PageHeader /> 

   
      {session ? <LoggedInDashboard /> : <LoggedOutLanding />}
    </div>
  );
}