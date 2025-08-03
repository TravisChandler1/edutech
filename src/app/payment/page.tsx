'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { initializePaystackPayment } from '@/lib/paystack';
import { useSession } from 'next-auth/react';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    // If user is not authenticated, redirect to signin
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent('/payment')}`);
    }
  }, [status, router]);

  const handlePayment = async () => {
    if (!session?.user?.email) {
      setError('Please sign in to continue');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get the user's selected plan (you might need to fetch this from your API)
      const response = await fetch('/api/auth/me');
      const user = await response.json();
      
      if (!user.selectedPlan) {
        throw new Error('No plan selected');
      }

      // Define plan prices (in kobo)
      const planPrices = {
        'Novice': 0,
        'Beginner': 1200000, // ₦12,000
        'Intermediate': 1800000, // ₦18,000
        'Advanced': 2500000, // ₦25,000
      };

      const amount = planPrices[user.selectedPlan as keyof typeof planPrices] || 0;

      // For free plan, just update the user status
      if (amount === 0) {
        const updateResponse = await fetch('/api/auth/update-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: user.selectedPlan,
            paymentStatus: 'completed',
          }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update plan');
        }

        router.push(redirectUrl);
        return;
      }

      // For paid plans, initialize payment
      initializePaystackPayment(
        session.user.email,
        amount,
        () => {
          // On success
          setIsLoading(false);
          router.push(redirectUrl);
        },
        () => {
          // On close
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred while processing your payment. Please try again.');
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please complete your payment to access all features
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md bg-blue-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Book Club Access
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>You currently have access to our Book Club features. To access all features, please complete your payment.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handlePayment}
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-yoruba-green/70' : 'bg-yoruba-green hover:bg-yoruba-green-dark'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green`}
            >
              {isLoading ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
