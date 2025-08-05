import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useAppStore } from '@melog/shared';
import BottomTabBar from './BottomTabBar';
export default function Layout({
  children,
  className = '',
  showTabBar = true,
}) {
  const { theme } = useAppStore();
  return _jsx('div', {
    className: 'min-h-svh bg-gray-100',
    children: _jsxs('div', {
      className: 'mx-auto w-[384px] bg-white min-h-svh shadow-xl relative',
      children: [
        _jsx('div', {
          className: `min-h-svh transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'} ${className}`,
          children: _jsx('main', {
            className: `px-4 w-full ${showTabBar ? '' : ''}`,
            children: children,
          }),
        }),
        showTabBar && _jsx(BottomTabBar, {}),
        _jsx('div', {
          className:
            'hidden lg:block absolute -left-4 top-0 w-1 h-full bg-gray-300 opacity-30',
        }),
        _jsx('div', {
          className:
            'hidden lg:block absolute -right-4 top-0 w-1 h-full bg-gray-300 opacity-30',
        }),
      ],
    }),
  });
}
