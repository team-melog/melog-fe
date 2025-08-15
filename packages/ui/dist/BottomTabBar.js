'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon, FeedIcon, CalendarIcon, ProfileIcon } from './assets/svgs';
const tabs = [
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
export default function BottomTabBar({ className = '', nickname, }) {
    const pathname = usePathname();
    return (_jsx("div", { className: `min-w-full sm:min-w-[360px] fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white border-t border-[#E3E2E2] h-[60px] z-50 ${className}`, children: _jsx("div", { className: "flex justify-around items-center h-full px-8", children: tabs.map(tab => {
                const isActive = pathname === tab.path || pathname === tab.activePath;
                const IconComponent = tab.icon;
                // 홈 탭일 때 조건부 라우팅
                if (tab.id === 'home') {
                    const handleHomeClick = (e) => {
                        e.preventDefault();
                        const targetPath = nickname ? '/emotion' : '/';
                        window.location.href = targetPath;
                    };
                    return (_jsx("button", { onClick: handleHomeClick, className: "flex flex-col items-center justify-center flex-1 h-full", children: _jsx(IconComponent, { className: "w-7 h-7 mb-1", isActive: isActive }) }, tab.id));
                }
                return (_jsx(Link, { href: tab.path, className: "flex flex-col items-center justify-center flex-1 h-full", prefetch: true, children: _jsx(IconComponent, { className: "w-7 h-7 mb-1", isActive: isActive }) }, tab.id));
            }) }) }));
}
