import { Metadata } from 'next';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import SessionsList from '@/components/teacher/sessions/SessionsList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Live Sessions | Yoruba Learning Hub',
  description: 'Manage your live teaching sessions',
};

export default async function SessionsPage() {
  const request = new NextRequest('http://localhost:3000/dashboard/teacher/sessions', {
    headers: headers()
  });
  
  const user = await auth.verifyAuth(request);
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?callbackUrl=/dashboard/teacher/sessions');
  }
  
  // Redirect to dashboard if not a teacher
  if (user.role !== 'teacher') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage your live teaching sessions
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/teacher/sessions/new">
            Schedule New Session
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
        </div>
      }>
        <SessionsList />
      </Suspense>
    </div>
  );
}
