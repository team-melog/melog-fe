'use client';

import { Layout, Button, Input } from '@melog/ui';
import { useAppStore } from '@/features/store';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCreateNickname } from '@/features/user/hooks/useUserApi';
import UserService from '@/features/user/api/userService';
// import { apiClient } from '@/shared';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useAppStore();
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const createNickname = useCreateNickname();

  // emotion 페이지 prefetch
  useEffect(() => {
    router.prefetch('/emotion');
  }, [router]);

  const handleNicknameSubmit = async () => {
    // 유효성 검사
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요');
      return;
    }

    if (nickname.trim().length < 2) {
      setError('2~10글자 사이로 입력해주세요');
      return;
    }

    if (nickname.trim().length > 10) {
      setError('2~10글자 사이로 입력해주세요');
      return;
    }

    // 특수문자 제한 (일부만 허용)
    const specialCharRegex = /[#%&]/;
    if (specialCharRegex.test(nickname)) {
      setError('닉네임에는 한글, 영어만 가능합니다');
      return;
    }

    // 유효한 경우 사용자 정보 저장
    setUser({ name: nickname.trim() });
    setError('');

    try {
      // 닉네임이 이미 존재하는지 확인
      const existingNickname = await UserService.getNickname(nickname.trim());

      // 이미 존재하는 경우 바로 emotion 페이지로 이동
      if (existingNickname) {
        router.push('/emotion');
        return;
      }
    } catch (error: unknown) {
      // 닉네임이 존재하지 않는 경우 새로 생성
      createNickname.mutate(nickname.trim(), {
        onSuccess: () => {
          router.push('/emotion');
        },
        onError: () => {
          router.push('/emotion');
        },
      });

      console.error(error);
      return;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNicknameSubmit();
    }
  };

  const onValidateNickname = (value: string) => {
    // 모든 특수문자 제한 (한글, 영문, 숫자만 허용)
    const specialCharRegex = /[^가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ\s]/;
    if (specialCharRegex.test(value)) {
      setError('닉네임에는 한글, 영어만 가능합니다');
      return false;
    }

    if (value.trim().length > 10) {
      setError('2~10글자 사이로 입력해주세요');
      return false;
    }
    return true;
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = e.target.value;
    setNickname(value);

    // 특수문자 검증
    if (!onValidateNickname(value)) {
      return;
    }
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-svh bg-white flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col pt-8">
          {/* Main Title */}
          <div className="flex-1 flex flex-col px-4 py-10">
            <h1 className="text-4xl font-meetme text-[#060607] mb-6 leading-tight">
              Me:log에서 사용할
              <br />
              닉네임을 입력해 주세요
            </h1>

            {/* Nickname Input */}
            <div className="w-full max-w-sm mx-auto space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder=""
                  value={nickname}
                  onChange={handleNicknameChange}
                  onKeyPress={handleKeyPress}
                  className="w-full text-3xl font-meetme border-none border-b-2 border-black rounded-none focus:ring-0 focus:border-black"
                  maxLength={10}
                />
                <div className="w-full h-0.5 bg-black mt-2"></div>
              </div>

              {error && (
                <p className="font-meetme text-[#FF5A5A] text-md ml-2">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleNicknameSubmit}
            disabled={!nickname.trim()}
            className="w-full bg-[#060607] hover:bg-[#2a2a2a] disabled:bg-[#B5B8C0] text-white font-meetme text-xl py-3 px-6transition-colors rounded-none"
          >
            확인
          </Button>
        </div>
      </div>
    </Layout>
  );
}
