'use client';

import React, { useState } from 'react';
import BrutalButton from '@/components/ui/BrutalButton';
import { lookupStatus } from './actions';

type StatusResult = {
  createdAt: Date | string | null;
  eventName: string | null;
  regId: string;
  status: string | null;
  teamName: string | null;
  transactionId: string | null;
};

function formatSubmittedAt(value: Date | string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function StatusPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<StatusResult[] | null>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setResults(null);
    setLoading(true);

    const response = await lookupStatus(query);
    setLoading(false);

    if ('error' in response) {
      setError(response.error);
      return;
    }

    setResults(response.results);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-20 min-h-[70vh]">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-on-surface italic mb-4">
          Check Status
        </h1>
        <p className="text-lg font-sans font-medium opacity-80">
          Enter your phone number or transaction ID to view your latest registration status.
        </p>
      </header>

      <form onSubmit={handleSearch} className="bg-surface-container p-8 brutal-border space-y-6">
        {error ? <div className="bg-red-200 text-red-900 border-2 border-red-500 font-bold p-4">{error}</div> : null}

        <div className="space-y-4">
          <label className="font-display font-black text-2xl uppercase italic">Phone or Transaction ID</label>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-surface brutal-input p-4 text-xl"
            placeholder="Example: 9876543210 or 123456789012"
            required
          />
        </div>

        <BrutalButton type="submit" size="xl" disabled={loading} className="w-full py-4">
          {loading ? 'Checking...' : 'Check Status'}
        </BrutalButton>
      </form>

      {results && results.length > 0 ? (
        <div className="mt-12 space-y-6">
          <h2 className="text-3xl font-black uppercase italic mb-6 border-b-4 border-on-surface pb-2">
            Your Registrations
          </h2>
          {results.map((registration) => (
            <div
              key={registration.regId}
              className="bg-surface p-6 brutal-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase text-primary-container leading-none">
                  {registration.eventName || 'Event'}
                </h3>
                <p className="font-bold opacity-80 uppercase text-sm">
                  {registration.teamName ? `Team: ${registration.teamName}` : 'Individual Registration'}
                </p>
                {registration.transactionId ? (
                  <p className="text-xs font-bold uppercase opacity-60">
                    Transaction ID: {registration.transactionId}
                  </p>
                ) : null}
                {registration.createdAt ? (
                  <p className="text-xs font-bold uppercase opacity-50">
                    Submitted: {formatSubmittedAt(registration.createdAt)}
                  </p>
                ) : null}
              </div>
              <div>
                <span
                  className={`px-4 py-2 font-black uppercase text-sm ${
                    registration.status === 'APPROVED'
                      ? 'bg-green-300 text-green-900 border-2 border-green-600'
                      : registration.status === 'REJECTED'
                        ? 'bg-red-300 text-red-900 border-2 border-red-600'
                        : 'bg-yellow-300 text-yellow-900 border-2 border-yellow-600'
                  }`}
                >
                  {registration.status || 'PENDING'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
