'use client';

import { Event } from '@/types';
import { EventCard } from './EventCard';

interface EventsListProps {
  events: Event[];
  isLoading?: boolean;
  viewType?: 'user' | 'company';
}

export function EventsList({ events, isLoading, viewType = 'user' }: EventsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="bg-secondary rounded-lg h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎪</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No events yet</h3>
        <p className="text-muted-foreground">
          {viewType === 'user'
            ? 'Check back soon for upcoming events'
            : 'Create your first event to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          actionUrl={
            viewType === 'user'
              ? `/user/events/${event.id}`
              : `/company/events/${event.id}/edit`
          }
          actionLabel={viewType === 'user' ? 'Get Tickets' : 'Edit Event'}
        />
      ))}
    </div>
  );
}
