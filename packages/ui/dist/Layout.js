import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BottomTabBar from './BottomTabBar';
import { usePathname } from 'next/navigation';
export default function Layout({ children, className = '', showTabBar = true, nickname, }) {
    const theme = 'light'; // 기본값으로 설정
    const pathname = usePathname();
    const isOnBoardingPage = pathname === '/onboarding' ||
        pathname.includes('/emotion/record') ||
        pathname.includes('/emotion/analysis') ||
        pathname.includes('/emotion/write') ||
        pathname.includes('/feed') ||
        pathname.includes('/profile');
    return (_jsx("div", { className: "min-h-svh bg-gray-100", children: _jsxs("div", { className: "mx-auto min-w-[360px] sm:w-[360px] bg-white min-h-svh shadow-xl relative", children: [_jsx("div", { className: `min-h-svh transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'} ${className}`, children: _jsx("main", { className: `w-full min-h-svh ${isOnBoardingPage ? '' : 'px-4'} `, children: children }) }), showTabBar && _jsx(BottomTabBar, { nickname: nickname }), _jsx("div", { className: "hidden lg:block absolute -left-4 top-0 w-1 h-full bg-gray-300 opacity-30" }), _jsx("div", { className: "hidden lg:block absolute -right-4 top-0 w-1 h-full bg-gray-300 opacity-30" })] }) }));
}
