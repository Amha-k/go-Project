'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userType, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'company') {
      router.push('/company/login');
    }
  }, [isAuthenticated, userType, router]);

  if (!isAuthenticated || userType !== 'company') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-muted sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            EventHub
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/company/dashboard" className="text-foreground hover:text-accent transition-colors">
              Dashboard
            </Link>
            <Link href="/company/events" className="text-foreground hover:text-accent transition-colors">
              My Events
            </Link>
            <Link href="/company/events/create" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors">
              Create Event
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 border border-muted rounded-md text-foreground hover:bg-secondary transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  );
}
