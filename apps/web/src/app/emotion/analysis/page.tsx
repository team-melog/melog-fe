"use client";

import { Layout } from "@melog/ui";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EmotionAnalysisPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(5);

  // 5초 카운트다운
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 5초 후 감정 분석 결과 화면으로 이동
          router.push("/emotion/result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-center text-black mb-12">
            감정 분석 중입니다
          </h1>

          {/* Loading Illustration */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-36 h-36 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600"></div>
            </div>
            <p className="text-base font-semibold text-black text-center">
              랜덤 일러스트
            </p>
          </div>

          {/* Loading Text */}
          <div className="text-center text-gray-600">
            <p className="text-sm mb-2">AI가 당신의 감정을 분석하고 있어요</p>
            <p className="text-xs">{timeLeft}초 후 결과를 확인할 수 있습니다</p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 bg-gray-200 rounded-full h-2 mt-8">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
