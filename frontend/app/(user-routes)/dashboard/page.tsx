'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Event } from '@/types';
import { EventsList } from '@/components/events/EventsList';

export default function UserDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getEvents();
      setEvents(response.data || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchEvents();
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.searchEvents(searchQuery);
      setEvents(response.data || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Browse Events</h1>
        <p className="text-muted-foreground mb-6">
          Discover and book tickets for amazing events near you
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by name..."
            className="flex-1 px-4 py-2 border border-muted rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 transition-all font-medium"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchEvents();
              }}
              className="px-4 py-2 border border-muted rounded-md text-foreground hover:bg-secondary transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <EventsList events={events} isLoading={isLoading} viewType="user" />
    </div>
  );
}
