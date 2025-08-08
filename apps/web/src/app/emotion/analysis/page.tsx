'use client';

import LottieSelectCharacters from '@/components/lotties/LottieSelectCharacters';
import { Layout } from '@melog/ui';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EmotionAnalysisPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeLeft, setTimeLeft] = useState(5);

  // 5초 카운트다운
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // 5초 후 감정 분석 결과 화면으로 이동
          router.push('/emotion/result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <Layout showTabBar={false}>
      <div className="font-meetme min-h-svh bg-[#111416] flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Title */}
          <h1 className="text-3xl font-meetme text-center text-white mb-4">
            AI가 감정을 분석중이에요
          </h1>

          <div className="text-2xl font-meetme text-center text-[#a5a5a5] mb-12">
            조금만 기다려 주세요
          </div>

          {/* Loading Animation */}
          <div className="flex flex-col items-center mb-12 mt-6">
            <div className="w-[100px] h-[100px] flex items-center justify-center">
              <LottieSelectCharacters />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
