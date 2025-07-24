export const initializePaystackPayment = (
  email: string,
  amount: number,
  callbackUrl: string,
  onSuccess: () => void,
  onClose: () => void
) => {
  // Use browser env variable for client-side only
  const paystackKey = (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) || '';
  const handler = (window as any).PaystackPop.setup({
    key: paystackKey,
    email,
    amount, // in kobo
    currency: 'NGN',
    callback: (response: any) => {
      onSuccess();
    },
    onClose,
  });
  handler.openIframe();
}; 