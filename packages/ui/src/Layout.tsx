import { ReactNode } from "react";
import { useAppStore } from "@melog/shared";
import BottomTabBar from "./BottomTabBar";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showTabBar?: boolean;
}

export default function Layout({
  children,
  className = "",
  showTabBar = true,
}: LayoutProps) {
  const { theme } = useAppStore();

  return (
    <div className="min-h-svh bg-gray-100">
      {/* Mobile-first layout - 고정 너비 384px, 데스크탑에서도 모바일 크기 유지 */}
      <div className="mx-auto w-[384px] bg-white min-h-svh shadow-xl relative">
        <div
          className={`min-h-svh transition-colors duration-300 ${
            theme === "dark" ? "dark bg-gray-900" : "bg-white"
          } ${className}`}
        >
          <main className={`px-4 w-full ${showTabBar ? "" : ""}`}>
            {children}
          </main>
        </div>

        {/* 하단 탭 바 */}
        {showTabBar && <BottomTabBar />}

        {/* 데스크탑에서 모바일 시뮬레이션을 위한 사이드 가이드 */}
        <div className="hidden lg:block absolute -left-4 top-0 w-1 h-full bg-gray-300 opacity-30"></div>
        <div className="hidden lg:block absolute -right-4 top-0 w-1 h-full bg-gray-300 opacity-30"></div>
      </div>
    </div>
  );
}
