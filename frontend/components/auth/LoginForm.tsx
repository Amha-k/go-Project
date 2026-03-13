'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, type LoginFormData } from '@/lib/validation';
import { apiClient } from '@/lib/api';
import { setAuthToken, setUserType } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  userType: 'user' | 'company';
}

export function LoginForm({ userType }: LoginFormProps) {
  const router = useRouter();
  const { setUser, setUserType: setContextUserType } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = userType === 'user'
        ? await apiClient.userLogin(data)
        : await apiClient.companyLogin(data);

      if (response.data.requiresMfa) {
        // Store temp token and redirect to MFA
        sessionStorage.setItem('tempToken', response.data.tempToken);
        router.push(`/mfa?userType=${userType}`);
        return;
      }

      // Store token and user data
      setAuthToken(response.data.token);
      setUserType(userType);
      setContextUserType(userType);
      setUser(response.data.user);

      // Redirect to dashboard
      const dashboard = userType === 'user' ? '/user/dashboard' : '/company/dashboard';
      router.push(dashboard);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
          placeholder="••••••"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md transition-all disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          href={userType === 'user' ? '/register' : '/company/register'}
          className="text-accent hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
