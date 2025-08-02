import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import SessionDetail from '@/components/teacher/sessions/SessionDetail';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const request = new NextRequest('http://localhost', { headers: Object.fromEntries(headersList.entries()) });
  const session = await auth.verifyAuth(request);
  let title = 'Session Details';
  
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
        title = `${data.title} | Session Details`;
      }
    } catch (error) {
      console.error('Error fetching session for metadata:', error);
    }
  }
  
  return {
    title: `${title} | Yoruba Learning Hub`,
  };
}

export default async function SessionDetailPage({ params }: Props) {
  const headersList = headers();
  const request = new NextRequest('http://localhost', { headers: Object.fromEntries(headersList.entries()) });
  const session = await auth.verifyAuth(request);
  
  // Redirect to login if not authenticated
  if (!session) {
    return notFound();
  }
  
  // Redirect to dashboard if not a teacher
  if (session.role !== 'teacher') {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Session Details</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your live teaching session
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <SessionDetail sessionId={params.id} />
      </div>
    </div>
  );
}
