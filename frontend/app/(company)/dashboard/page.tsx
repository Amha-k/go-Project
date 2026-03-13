'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Event } from '@/types';

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getCompanyEvents();
      setEvents(response.data || []);
    } catch (err: any) {
      console.error('Failed to load events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalTicketsSold = events.reduce(
    (sum, event) => sum + (event.tickets?.length || 0),
    0
  );
  const totalRevenue = events.reduce(
    (sum, event) =>
      sum + (event.tickets?.reduce((ticketSum, ticket) => ticketSum + ticket.price, 0) || 0),
    0
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          {user?.name}, here's what's happening with your events.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-background border border-muted rounded-lg p-6">
          <p className="text-muted-foreground text-sm mb-2">Total Events</p>
          <p className="text-3xl font-bold text-foreground">{events.length}</p>
        </div>
        <div className="bg-background border border-muted rounded-lg p-6">
          <p className="text-muted-foreground text-sm mb-2">Tickets Sold</p>
          <p className="text-3xl font-bold text-accent">{totalTicketsSold}</p>
        </div>
        <div className="bg-background border border-muted rounded-lg p-6">
          <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-accent">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-background border border-muted rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Recent Events</h2>
          <Link
            href="/company/events/create"
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Create Event
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-secondary rounded h-16 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No events yet</p>
            <Link
              href="/company/events/create"
              className="text-accent hover:underline font-medium"
            >
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <Link
                key={event.id}
                href={`/company/events/${event.id}/edit`}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-opacity-75 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.tickets?.length || 0} tickets sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-accent">
                    ${event.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
