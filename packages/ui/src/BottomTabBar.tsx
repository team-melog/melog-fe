'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon, FeedIcon, CalendarIcon, ProfileIcon } from './assets/svgs';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; isActive?: boolean }>;
  path: string;
  activePath?: string;
}

interface BottomTabBarProps {
  className?: string;
}

const tabs: TabItem[] = [
  {
    id: 'home',
    label: '홈',
    icon: HomeIcon,
    path: '/',
    activePath: '/emotion',
  },
  {
    id: 'feed',
    label: '피드',
    icon: FeedIcon,
    path: '/feed',
  },
  {
    id: 'calendar',
    label: '캘린더',
    icon: CalendarIcon,
    path: '/calendar',
  },
  {
    id: 'profile',
    label: '마이',
    icon: ProfileIcon,
    path: '/profile',
  },
];

export default function BottomTabBar({ className = '' }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <div
      className={`min-w-full sm:min-w-[360px] fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white border-t border-[#E3E2E2] h-[60px] z-50 ${className}`}
    >
      <div className="flex justify-around items-center h-full px-8">
        {tabs.map(tab => {
          const isActive = pathname === tab.path || pathname === tab.activePath;
          const IconComponent = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.path}
              className="flex flex-col items-center justify-center flex-1 h-full"
              prefetch={true}
            >
              <IconComponent className="w-7 h-7 mb-1" isActive={isActive} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
