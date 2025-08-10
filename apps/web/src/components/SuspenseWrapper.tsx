'use client';

import { Suspense, ReactNode } from 'react';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function SuspenseWrapper({
  children,
  fallback = <div>Loading...</div>,
}: SuspenseWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
