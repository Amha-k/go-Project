'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { EventForm } from '@/components/events/EventForm';
import { CreateEventFormData } from '@/lib/validation';
import { Event } from '@/types';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch the event data - we'll need to get it from the company events list
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getCompanyEvents();
      const foundEvent = response.data?.find((e: Event) => e.id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        setError('Event not found');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CreateEventFormData) => {
    setIsSaving(true);
    try {
      await apiClient.updateEvent(eventId, {
        name: data.name,
        description: data.description,
        price: data.price,
        eventDate: new Date(data.eventDate).toISOString(),
        ticketNumber: data.ticketNumber,
      });

      router.push('/company/events');
    } catch (err: any) {
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <div className="bg-secondary rounded-lg h-96 animate-pulse" />
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-4">Event not found</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/company/events" className="text-accent hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/company/events" className="text-accent hover:underline mb-4 inline-block">
          ← Back to events
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-2">Edit Event</h1>
        <p className="text-muted-foreground">
          Update the details of your event
        </p>
      </div>

      <div className="bg-background border border-muted rounded-lg p-8">
        <EventForm
          initialData={event}
          isLoading={isSaving}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
