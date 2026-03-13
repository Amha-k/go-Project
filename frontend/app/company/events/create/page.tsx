'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { EventForm } from '@/components/events/EventForm';
import { CreateEventFormData } from '@/lib/validation';

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateEventFormData) => {
    setIsLoading(true);
    try {
      await apiClient.createEvent({
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
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/company/events" className="text-accent hover:underline mb-4 inline-block">
          ← Back to events
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-2">Create New Event</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create your event
        </p>
      </div>

      <div className="bg-background border border-muted rounded-lg p-8">
        <EventForm isLoading={isLoading} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
