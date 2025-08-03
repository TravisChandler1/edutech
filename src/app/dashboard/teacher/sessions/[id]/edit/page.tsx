import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import SessionForm from '@/components/teacher/sessions/SessionForm';

type Props = {
  params: { id: string };
};

interface SessionData {
  id: string;
  title: string;
  description: string;
  startTime: string;
  durationMinutes: number;  // Changed from duration to durationMinutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meetingLink?: string;
  meetingPassword?: string;
  maxParticipants?: number;
  teacherId: string;
  groupId?: string | null;
  planId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const request = new NextRequest('http://localhost', { headers: Object.fromEntries(headersList.entries()) });
  const session = await auth.verifyAuth(request);
  let title = 'Edit Session';
  
  // Only fetch session data if user is authenticated
  if (session?.role === 'teacher') {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/teacher/sessions/${params.id}`,
        {
          headers: {
            cookie: headers().get('cookie') || '',
          },
        }
      );
      
      if (res.ok) {
        const { data } = await res.json();
        title = `Edit ${data.title} | Session`;
      }
    } catch (error) {
      console.error('Error fetching session for metadata:', error);
    }
  }
  
  return {
    title: `${title} | Yoruba Learning Hub`,
  };
}

export default async function EditSessionPage({ params }: Props) {
  const headersList = headers();
  const request = new NextRequest('http://localhost', { headers: Object.fromEntries(headersList.entries()) });
  const session = await auth.verifyAuth(request);
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect(`/login?callbackUrl=/dashboard/teacher/sessions/${params.id}/edit`);
  }
  
  // Redirect to dashboard if not a teacher
  if (session.role !== 'teacher') {
    return notFound();
  }

  // Fetch the session data
  let sessionData: SessionData | null = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/teacher/sessions/${params.id}`,
      {
        headers: {
          cookie: headers().get('cookie') || '',
        },
      }
    );
    
    if (!res.ok) {
      return notFound();
    }
    
    const response = await res.json();
    sessionData = response.data;
    
    // Handle case where sessionData is null or undefined
    if (!sessionData) {
      return notFound();
    }
    
    // Don't allow editing if session is in progress or completed
    if (['in_progress', 'completed', 'cancelled'].includes(sessionData.status)) {
      return notFound();
    }
  } catch (error) {
    console.error('Error fetching session:', error);
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Session</h1>
        <p className="text-muted-foreground mt-1">
          Update the details of your live teaching session
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <SessionForm initialData={sessionData} />
      </div>
    </div>
  );
}
