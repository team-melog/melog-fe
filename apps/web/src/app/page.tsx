'use client';

import { Layout, Button, MelogLogoIcon } from '@melog/ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  // 1뎁스 페이지들 prefetch
  useEffect(() => {
    router.prefetch('/onboarding');
    router.prefetch('/feed');
    router.prefetch('/calendar');
    router.prefetch('/profile');
    router.prefetch('/emotion');
  }, [router]);

  const handleStart = () => {
    // 닉네임 입력 화면으로 이동
    router.push('/onboarding');
  };

  return (
    <Layout showTabBar={false}>
      {/* 온보딩 화면 - Figma 온보딩 기반 */}
      <div className="font-meetme min-h-screen bg-white flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="flex flex-col items-center justify-center">
            {/* Main Title */}
            <MelogLogoIcon />
            <h1 className="text-4xl text-center text-[#060607] mb-6 leading-tight mt-2">
              AI가 분석해주는
              <br />
              나의 진짜 감정
            </h1>
            {/* Subtitle */}
            <p className="text-2xl text-center text-[#4e515b] mb-12 leading-tight">
              오늘의 감정을 입체적으로 이해해 보세요
            </p>
          </div>

          {/* Main Illustration Placeholder */}
          <div className="w-60 h-60 mb-20 flex items-center justify-center bg-gray-200 rounded-lg">
            {/* 이미지 영역 - 실제 이미지는 제외 */}
          </div>
          {/* Start Button */}
          <Button
            onClick={handleStart}
            className="w-4/5 h-12 bg-[#060607] hover:bg-[#2a2a2a] text-white text-xl py-3 px-6 rounded-3xl transition-colors"
          >
            시작하기
          </Button>
        </div>
      </div>
    </Layout>
  );
}
