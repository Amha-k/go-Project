'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { User } from '@/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (user && 'mfaEnabled' in user) {
      setMfaEnabled((user as User).mfaEnabled || false);
    }
  }, [user]);

  const handleEnableMFA = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiClient.enableMFA();
      setMfaSecret(response.data.secret);
      setSuccess('MFA setup initialized. Scan the QR code with your authenticator app.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to enable MFA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold text-foreground mb-8">My Profile</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          {success}
        </div>
      )}

      {/* Account Info */}
      <div className="bg-background border border-muted rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Account Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Name</label>
            <p className="text-lg text-foreground">{user?.name || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Email</label>
            <p className="text-lg text-foreground">{user?.email || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Account Type</label>
            <p className="text-lg text-foreground">Event Attendee</p>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Member Since</label>
            <p className="text-lg text-foreground">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-background border border-muted rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Security Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-muted rounded-lg">
            <div>
              <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {mfaEnabled ? 'Enabled' : 'Add an extra layer of security to your account'}
              </p>
            </div>
            {!mfaEnabled ? (
              <button
                onClick={handleEnableMFA}
                disabled={isLoading}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Setting up...' : 'Enable'}
              </button>
            ) : (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-md font-medium">
                Enabled
              </span>
            )}
          </div>

          {mfaSecret && !mfaEnabled && (
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                Scan this QR code with your authenticator app:
              </p>
              <div className="bg-white p-4 rounded inline-block">
                {/* QR Code would be rendered here */}
                <p className="text-xs text-muted-foreground">Secret: {mfaSecret}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
