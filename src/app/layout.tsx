'use client';
import '../app/globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { LoadingProvider } from '../components/LoadingProvider';
import { AuthProvider } from '../components/AuthProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
        <AuthProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 