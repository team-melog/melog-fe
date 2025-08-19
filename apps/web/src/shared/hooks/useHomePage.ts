'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from '@/features/store';

export function useHomePage() {
  const router = useRouter();
  const nickname = useAppStore(state => state.user.name);

  // 1뎁스 페이지들 prefetch
  useEffect(() => {
    if (nickname) {
      router.push('/emotion');
      return;
    }

    router.prefetch('/onboarding');
    router.prefetch('/feed');
    router.prefetch('/calendar');
    router.prefetch('/profile');
    router.prefetch('/emotion');
  }, [router, nickname]);

  const handleStart = () => {
    // 닉네임 입력 화면으로 이동
    router.push('/onboarding');
  };

  return {
    nickname,
    handleStart,
  };
}
