'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useRouter, usePathname } from 'next/navigation';
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
export default function BottomTabBar({ className = '' }) {
    const router = useRouter();
    const pathname = usePathname();
    const handleTabPress = (path) => {
        if (pathname !== path) {
            router.push(path);
        }
    };
    //  className={`fixed bottom-0 left-1/2 transform -translate-x-1/2  bg-white border-t border-gray-200 shadow-lg ${className}`}
    return (_jsx("div", { className: `w-[360px] fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white border-t border-[#E3E2E2] h-[60px] z-50 ${className}`, children: _jsx("div", { className: "flex justify-around items-center h-full px-8", children: tabs.map(tab => {
                const isActive = pathname === tab.path || pathname === tab.activePath;
                const IconComponent = tab.icon;
                return (_jsx("button", { onClick: () => handleTabPress(tab.path), className: "flex flex-col items-center justify-center flex-1 h-full", children: _jsx(IconComponent, { className: "w-7 h-7 mb-1", isActive: isActive }) }, tab.id));
            }) }) }));
}
