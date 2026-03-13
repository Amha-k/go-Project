'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { paymentSchema } from '@/lib/validation';
import { api } from '@/lib/api';

interface PaymentFormProps {
  eventId: number;
  eventName: string;
  price: number;
  onSuccess: () => void;
}

export function PaymentForm({ eventId, eventName, price, onSuccess }: PaymentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useStripe, setUseStripe] = useState(false);

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      email: '',
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const handleRegularPayment = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/users/events/${eventId}/buy`, {
        quantity: 1,
        email: data.email,
      });

      if (response.data.success) {
        onSuccess();
      } else {
        setError(response.data.message || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/users/events1/${eventId}/buy`, {
        quantity: 1,
      });

      if (response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        setError('Failed to create payment session');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Stripe payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Complete Your Purchase</CardTitle>
        <CardDescription>{eventName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 p-3 bg-muted rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Ticket Price:</span>
            <span className="font-semibold">${price.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-semibold">Total:</span>
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
          </div>
        </div>

        {!useStripe ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegularPayment)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="4111 1111 1111 1111" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="123" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pay ${price.toFixed(2)}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">You will be redirected to Stripe to complete your payment securely.</p>
            <Button onClick={handleStripePayment} className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue to Stripe
            </Button>
          </div>
        )}

        <Button variant="outline" className="w-full" onClick={() => setUseStripe(!useStripe)}>
          {useStripe ? 'Use Regular Payment' : 'Use Stripe Payment'}
        </Button>
      </CardContent>
    </Card>
  );
}
