import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">EventHub</div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-foreground hover:text-accent transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Discover & Book Amazing Events
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find concerts, conferences, meetups, and more. Create your own events and reach thousands of attendees.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Browse Events
              </Link>
              <Link
                href="/company/register"
                className="px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-colors font-medium"
              >
                Start Organizing
              </Link>
            </div>
          </div>
          <div className="bg-secondary rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-muted-foreground">Event marketplace illustration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary border-t border-b border-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why EventHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Easy Booking',
                description: 'Book tickets in seconds with secure payment processing',
                icon: '🎫',
              },
              {
                title: 'Create Events',
                description: 'Launch your event and manage everything from one dashboard',
                icon: '📅',
              },
              {
                title: 'Secure Payments',
                description: 'Support for multiple payment methods including Stripe',
                icon: '💳',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-background p-6 rounded-lg border border-muted">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">
            © 2026 EventHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
