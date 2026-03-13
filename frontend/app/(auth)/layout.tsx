import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | EventHub',
  description: 'Sign in or create an account to manage your events',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
