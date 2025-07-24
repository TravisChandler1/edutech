'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, MouseEvent } from 'react';
import { useLoading } from './LoadingProvider';

interface LoadingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

export default function LoadingLink({ 
  href, 
  children, 
  className, 
  onClick,
  ...props 
}: LoadingLinkProps) {
  const router = useRouter();
  const { setLoading } = useLoading();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't trigger loading for external links or same page links
    if (href.startsWith('http') || href.startsWith('#') || href === window.location.pathname) {
      if (onClick) onClick();
      return;
    }

    e.preventDefault();
    
    // Trigger loading state
    setLoading(true);
    
    // Execute custom onClick if provided
    if (onClick) onClick();
    
    // Navigate after a short delay to show the loading state
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <Link 
      href={href} 
      className={className} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}