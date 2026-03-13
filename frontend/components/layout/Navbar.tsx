'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, Ticket, BarChart3 } from 'lucide-react';

export function Navbar() {
  const { user, userType, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isUser = userType === 'user';

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">EventHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {!user ? (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
                <Link href="/register" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Sign Up
                </Link>
                <Link href="/company/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Company
                </Link>
              </>
            ) : (
              <>
                {isUser ? (
                  <>
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      Browse Events
                    </Link>
                    <Link href="/tickets" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      My Tickets
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      Dashboard
                    </Link>
                    <Link href="/events" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      My Events
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isUser && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/tickets" className="cursor-pointer">
                          <Ticket className="mr-2 h-4 w-4" />
                          My Tickets
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {!isUser && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/events" className="cursor-pointer">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Manage Events
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
