'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Event } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getEventById(eventId);
      setEvent(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyTicket = async () => {
    try {
      setIsProcessing(true);
      setError('');

      // First try regular payment
      const response = await apiClient.buyTicket(eventId);

      if (response.data.redirectUrl) {
        // Redirect to payment verification page
        window.location.href = response.data.redirectUrl;
      } else {
        // Show success message and redirect to tickets
        router.push('/user/tickets?success=true');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to purchase ticket');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeCheckout = async () => {
    try {
      setIsProcessing(true);
      setError('');

      const response = await apiClient.buyTicketStripe(eventId);

      if (response.data.redirectUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.data.redirectUrl;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate Stripe payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-secondary rounded-lg h-96 animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="bg-secondary rounded h-8 animate-pulse w-3/4" />
          <div className="bg-secondary rounded h-32 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">Event not found</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/user/dashboard" className="text-accent hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  const totalPrice = event.price * quantity;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/user/dashboard" className="text-accent hover:underline mb-6 inline-block">
        ← Back to events
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Event Image */}
          <div className="bg-secondary rounded-lg h-96 flex items-center justify-center mb-6">
            <div className="text-6xl">🎪</div>
          </div>

          {/* Event Details */}
          <div className="bg-background border border-muted rounded-lg p-6">
            <h1 className="text-3xl font-bold text-foreground mb-4">{event.name}</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-muted-foreground text-sm">Event Date</p>
                <p className="text-foreground font-medium">{formatDate(event.eventDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Tickets Available</p>
                <p className="text-foreground font-medium">{event.ticketNumber}</p>
              </div>
            </div>

            <div className="border-t border-muted pt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">About this event</h2>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar - Booking Card */}
        <div>
          <div className="bg-secondary border border-muted rounded-lg p-6 sticky top-24">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <div className="mb-6">
              <p className="text-muted-foreground text-sm mb-2">Price per ticket</p>
              <p className="text-3xl font-bold text-accent">{formatPrice(event.price)}</p>
            </div>

            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                Number of tickets
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border border-muted rounded hover:bg-background transition-colors"
                  disabled={isProcessing}
                >
                  −
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-3 py-2 border border-muted rounded bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-accent"
                  min="1"
                  max={event.ticketNumber}
                  disabled={isProcessing}
                />
                <button
                  onClick={() => setQuantity(Math.min(event.ticketNumber, quantity + 1))}
                  className="px-3 py-2 border border-muted rounded hover:bg-background transition-colors"
                  disabled={isProcessing || quantity >= event.ticketNumber}
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-muted pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                Total: {formatPrice(totalPrice)}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBuyTicket}
                disabled={isProcessing || quantity > event.ticketNumber}
                className="w-full bg-accent hover:bg-opacity-90 text-white font-medium py-3 rounded-md transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Buy Now'}
              </button>
              <button
                onClick={handleStripeCheckout}
                disabled={isProcessing || quantity > event.ticketNumber}
                className="w-full border border-accent text-accent hover:bg-accent hover:text-white font-medium py-3 rounded-md transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Pay with Stripe'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
