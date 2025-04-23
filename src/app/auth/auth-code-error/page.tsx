
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
      <div className="p-8 bg-card text-card-foreground rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h1>
        <p className="mb-6">Sorry, we couldn't sign you in due to an issue during the authentication process. Please try signing in again.</p>
        <Button asChild>
          <Link href="/auth">Go to Login</Link>
        </Button>
      </div>
    </div>
  );
}