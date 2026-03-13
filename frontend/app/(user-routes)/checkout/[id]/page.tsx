'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/lib/api';
import type { Event } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.id);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/users/events`);
        const foundEvent = response.data.find((e: Event) => e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handlePaymentSuccess = () => {
    router.push('/tickets?success=true');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-2xl px-4">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-2xl px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Event not found'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Event Summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                  <p className="text-muted-foreground text-sm">{event.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Event Date:</span>
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span>TBD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Tickets:</span>
                    <span>{event.ticket_number}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Unit Price:</span>
                    <span>${event.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Quantity:</span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold mt-4">
                    <span>Total:</span>
                    <span>${event.price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <PaymentForm
              eventId={event.id}
              eventName={event.name}
              price={event.price}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
