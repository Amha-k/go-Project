'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerSchema, type RegisterFormData } from '@/lib/validation';
import { apiClient } from '@/lib/api';
import { setAuthToken, setUserType } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterFormProps {
  userType: 'user' | 'company';
}

export function RegisterForm({ userType }: RegisterFormProps) {
  const router = useRouter();
  const { setUser, setUserType: setContextUserType } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = userType === 'user'
        ? await apiClient.userRegister({
            name: data.name,
            email: data.email,
            password: data.password,
          })
        : await apiClient.companyRegister({
            name: data.name,
            email: data.email,
            password: data.password,
          });

      // Store token and user data
      setAuthToken(response.data.token);
      setUserType(userType);
      setContextUserType(userType);
      setUser(response.data.user);

      // Redirect to dashboard
      const dashboard = userType === 'user' ? '/user/dashboard' : '/company/dashboard';
      router.push(dashboard);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {userType === 'user' ? 'Full Name' : 'Company Name'}
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
          placeholder={userType === 'user' ? 'John Doe' : 'Acme Inc'}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

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

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
          placeholder="••••••"
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md transition-all disabled:opacity-50"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={userType === 'user' ? '/login' : '/company/login'}
          className="text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
