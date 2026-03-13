import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function CompanyRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">EventHub</h1>
          <p className="text-muted-foreground">Create your organizer account</p>
        </div>

        <RegisterForm userType="company" />

        <div className="mt-6 pt-6 border-t border-muted text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Are you an event attendee?
          </p>
          <Link
            href="/register"
            className="inline-block px-4 py-2 border border-muted rounded-md hover:bg-secondary transition-colors text-foreground font-medium"
          >
            Sign up as attendee
          </Link>
        </div>
      </div>
    </div>
  );
}
