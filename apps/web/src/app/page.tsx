"use client";

import { Layout, Button } from "@melog/ui";
import { useAppStore } from "@melog/shared";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { theme, setTheme } = useAppStore();

  const handleStart = () => {
    // 닉네임 입력 화면으로 이동
    router.push("/onboarding");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Layout showTabBar={false}>
      {/* 온보딩 화면 - Figma 온보딩_3 기반 */}
      <div className="min-h-screen bg-white flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          {/* Main Title */}
          <h1 className="text-2xl font-semibold text-center text-black mb-4 leading-tight">
            AI가 분석해주는
            <br />
            나의 진짜 감정
          </h1>

          {/* Subtitle */}
          <p className="text-base text-center text-black mb-12 leading-6">
            당신의 감정을 더 입체적으로 이해해보세요
          </p>

          {/* Main Illustration */}
          <div className="w-36 h-36 bg-gray-300 rounded-lg mb-8 flex items-center justify-center">
            <span className="text-4xl">🎨</span>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStart}
            className="w-full max-w-sm bg-gray-400 hover:bg-gray-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            시작하기
          </Button>

          {/* Theme Toggle (Hidden by default, can be accessed via dev tools) */}
          <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-2 bg-gray-200 rounded-full opacity-50 hover:opacity-100 transition-opacity"
            title="테마 변경"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
