'use client';
import '../app/globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { LoadingProvider } from '../components/LoadingProvider';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
        <AuthProvider>
          <LoadingProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}