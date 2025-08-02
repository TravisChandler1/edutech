import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import SessionForm from '@/components/teacher/sessions/SessionForm';

export const metadata: Metadata = {
  title: 'Schedule New Session | Yoruba Learning Hub',
  description: 'Schedule a new live teaching session',
};

export default async function NewSessionPage() {
  const headersList = headers();
  const request = new NextRequest('http://localhost', { headers: Object.fromEntries(headersList.entries()) });
  const session = await auth.verifyAuth(request);
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login?callbackUrl=/dashboard/teacher/sessions/new');
  }
  
  // Redirect to dashboard if not a teacher
  if (session.role !== 'teacher') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule New Session</h1>
        <p className="text-muted-foreground mt-1">
          Create a new live teaching session for your students
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <SessionForm />
      </div>
    </div>
  );
}
