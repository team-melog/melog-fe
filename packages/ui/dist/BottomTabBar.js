'use client';
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useRouter, usePathname } from 'next/navigation';
const tabs = [
  {
    id: 'home',
    label: '홈',
    icon: '🏠',
    activeIcon: '🏠',
    path: '/',
  },
  {
    id: 'feed',
    label: '피드',
    icon: '📊',
    activeIcon: '📊',
    path: '/feed',
  },
  {
    id: 'calendar',
    label: '캘린더',
    icon: '📅',
    activeIcon: '📅',
    path: '/calendar',
  },
  {
    id: 'profile',
    label: '마이',
    icon: '👤',
    activeIcon: '👤',
    path: '/profile',
  },
];
export default function BottomTabBar({ className = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const handleTabPress = path => {
    if (pathname !== path) {
      router.push(path);
    }
  };
  return _jsxs('div', {
    className: `fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[384px] bg-white border-t border-gray-200 shadow-lg ${className}`,
    children: [
      _jsx('div', {
        className: 'flex items-center justify-around py-2',
        children: tabs.map(tab => {
          const isActive = pathname === tab.path;
          return _jsxs(
            'button',
            {
              onClick: () => handleTabPress(tab.path),
              className: `flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-all duration-200 relative ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 active:text-blue-500'
              }`,
              children: [
                _jsx('div', {
                  className: `text-xl mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`,
                  children: isActive ? tab.activeIcon : tab.icon,
                }),
                _jsx('span', {
                  className: `text-xs font-medium transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-500'}`,
                  children: tab.label,
                }),
                isActive &&
                  _jsx('div', {
                    className:
                      'absolute bottom-0 w-6 h-0.5 bg-blue-600 rounded-t-full',
                  }),
              ],
            },
            tab.id
          );
        }),
      }),
      _jsx('div', {
        className: 'flex justify-center pb-2',
        children: _jsx('div', {
          className: 'w-32 h-1 bg-gray-300 rounded-full',
        }),
      }),
    ],
  });
}
