'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Ticket } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';

export default function TicketsPage() {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (searchParams.get('success')) {
      setSuccessMessage('Ticket purchased successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getUserTickets();
      setTickets(response.data || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tickets');
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-foreground mb-8">My Tickets</h1>

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-secondary rounded-lg h-24 animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-secondary rounded-lg">
          <div className="text-5xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No tickets yet</h3>
          <p className="text-muted-foreground">
            You haven't purchased any tickets yet. Browse events to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-background border border-muted rounded-lg p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-2xl">🎫</div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Ticket #{ticket.id.slice(0, 8)}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Purchased on {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="mb-2">
                  <p className="text-muted-foreground text-sm">Price</p>
                  <p className="text-2xl font-bold text-accent">
                    {formatPrice(ticket.price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : ticket.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {ticket.paymentStatus.charAt(0).toUpperCase() + ticket.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
