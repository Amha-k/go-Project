'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Event } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';

export default function CompanyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getCompanyEvents();
      setEvents(response.data || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await apiClient.deleteEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Events</h1>
          <p className="text-muted-foreground">
            Manage and track all your events
          </p>
        </div>
        <Link
          href="/company/events/create"
          className="px-6 py-3 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors font-medium"
        >
          Create Event
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-secondary rounded-lg h-24 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-secondary rounded-lg">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No events yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first event to get started
          </p>
          <Link
            href="/company/events/create"
            className="inline-block px-6 py-3 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors font-medium"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-background border border-muted rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {event.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">
                        {formatDate(event.eventDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium text-accent">
                        {formatPrice(event.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tickets Available</p>
                      <p className="font-medium text-foreground">
                        {event.ticketNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tickets Sold</p>
                      <p className="font-medium text-foreground">
                        {event.tickets?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/company/events/${event.id}/edit`}
                    className="px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
