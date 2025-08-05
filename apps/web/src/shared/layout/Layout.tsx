import { ReactNode } from 'react';
import { useAppStore } from '@/features/store';
import { BottomTabBar } from '@melog/ui';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showTabBar?: boolean;
}

export default function Layout({
  children,
  className = '',
  showTabBar = false,
}: LayoutProps) {
  const { theme } = useAppStore();

  return (
    <div
      className={`min-h-screen bg-background transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''} ${className}`}
    >
      <main
        className={`container mx-auto px-4 py-6 ${showTabBar ? 'pb-20' : ''}`}
      >
        {children}
      </main>
      {showTabBar && <BottomTabBar />}
    </div>
  );
}
