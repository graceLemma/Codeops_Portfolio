import { redirect } from 'next/navigation';
import TaskDashboard from '@/components/TaskDashboard';

async function getSession() {
  const isAuthenticated = true; 
  return isAuthenticated ? { user: { id: 'usr_123', email: 'developer@ibtcollegelife.ca' } } : null;
}

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await getSession();
  if (!session) {
    redirect('/signin?next=/dashboard');
  }

  const recordId = resolvedSearchParams.id;
  if (recordId && recordId !== 'usr_123') {
    throw new Error('Unauthorized: You do not have permission to view this record.');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Project Dashboard</h2>
        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
          Authenticated as {session.user.email}
        </span>
      </div>
      <TaskDashboard />
    </div>
  );
}