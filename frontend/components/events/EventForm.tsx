'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { createEventSchema, type CreateEventFormData } from '@/lib/validation';
import { Event } from '@/types';

interface EventFormProps {
  initialData?: Event;
  isLoading?: boolean;
  onSubmit: (data: CreateEventFormData) => Promise<void>;
}

export function EventForm({ initialData, isLoading = false, onSubmit }: EventFormProps) {
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      price: initialData.price,
      eventDate: new Date(initialData.eventDate).toISOString().slice(0, 16),
      ticketNumber: initialData.ticketNumber,
    } : undefined,
  });

  const handleFormSubmit = async (data: CreateEventFormData) => {
    setError('');
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Event Name
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-4 py-2 border border-muted rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="e.g., Summer Music Festival"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={5}
          className="w-full px-4 py-2 border border-muted rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          placeholder="Describe your event in detail..."
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price per Ticket (USD)
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            id="price"
            step="0.01"
            className="w-full px-4 py-2 border border-muted rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="ticketNumber" className="block text-sm font-medium mb-2">
            Number of Tickets
          </label>
          <input
            {...register('ticketNumber', { valueAsNumber: true })}
            type="number"
            id="ticketNumber"
            className="w-full px-4 py-2 border border-muted rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="100"
          />
          {errors.ticketNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.ticketNumber.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium mb-2">
          Event Date & Time
        </label>
        <input
          {...register('eventDate')}
          type="datetime-local"
          id="eventDate"
          className="w-full px-4 py-2 border border-muted rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.eventDate && (
          <p className="text-red-600 text-sm mt-1">{errors.eventDate.message}</p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-accent hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-md transition-all disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
