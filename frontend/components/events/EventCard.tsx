'use client';

import Link from 'next/link';
import { Event } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  actionUrl?: string;
  actionLabel?: string;
}

export function EventCard({ event, actionUrl, actionLabel = 'View Details' }: EventCardProps) {
  return (
    <div className="bg-background border border-muted rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-secondary h-40 flex items-center justify-center">
        <div className="text-4xl">🎪</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {event.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="text-foreground font-medium">{formatDate(event.eventDate)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="text-accent font-medium text-lg">{formatPrice(event.price)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Tickets Available</span>
            <span className="text-foreground font-medium">{event.ticketNumber}</span>
          </div>
        </div>
        {actionUrl && (
          <Link
            href={actionUrl}
            className="block w-full bg-accent hover:bg-opacity-90 text-white font-medium py-2 rounded-md text-center transition-all"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
