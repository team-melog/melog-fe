import { ReactNode } from 'react';
import BottomTabBar from './BottomTabBar';
import { usePathname } from 'next/navigation';
import FloatingButton from './FloatingButton';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showTabBar?: boolean;
  nickname?: string | null;
  showFloatingButton?: boolean;
  showFloatingButtonBorder?: boolean;
}

export default function Layout({
  children,
  className = '',
  showTabBar = true,
  nickname,
  showFloatingButton = false,
  showFloatingButtonBorder = false,
}: LayoutProps) {
  const pathname = usePathname();
  const isOnBoardingPage =
    pathname === '/onboarding' ||
    pathname === '/emotion' ||
    pathname === '/emotion/record' ||
    pathname === '/emotion/analysis' ||
    pathname === '/emotion/write' ||
    pathname.includes('/feed') ||
    pathname.includes('/profile');

  return (
    <div className={`min-h-svh bg-gray-100 ${className}`}>
      {/* Mobile-first layout - 고정 너비 360px, 데스크탑에서도 모바일 크기 유지 */}
      <div
        className={`mx-auto min-w-[360px] sm:w-[360px] bg-white min-h-svh shadow-xl relative ${className}`}
      >
        <div
          className={`min-h-svh transition-colors duration-300 bg-white ${className}`}
        >
          <main
            className={`w-full min-h-svh ${isOnBoardingPage ? '' : 'px-4'} `}
          >
            {children}
          </main>
        </div>

        {/* 하단 탭 바 */}
        {showTabBar && <BottomTabBar nickname={nickname} />}

        {/* 플로팅 버튼 */}
        {showFloatingButton && (
          <FloatingButton showBorder={showFloatingButtonBorder} />
        )}

        {/* 데스크탑에서 모바일 시뮬레이션을 위한 사이드 가이드 */}
        <div className="hidden lg:block absolute -left-4 top-0 w-1 h-full bg-gray-300 opacity-30"></div>
        <div className="hidden lg:block absolute -right-4 top-0 w-1 h-full bg-gray-300 opacity-30"></div>
      </div>
    </div>
  );
}
