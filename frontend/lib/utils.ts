import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from 'js-cookie';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function setAuthToken(token: string): void {
  Cookies.set('authToken', token, { expires: 7 });
}

export function getAuthToken(): string | undefined {
  return Cookies.get('authToken');
}

export function removeAuthToken(): void {
  Cookies.remove('authToken');
}

export function setUserType(type: 'user' | 'company'): void {
  Cookies.set('userType', type, { expires: 7 });
}

export function getUserType(): 'user' | 'company' | undefined {
  return Cookies.get('userType') as 'user' | 'company' | undefined;
}

export function removeUserType(): void {
  Cookies.remove('userType');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
