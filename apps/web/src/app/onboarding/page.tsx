"use client";

import { Layout, Button, Input } from "@melog/ui";
import { useAppStore } from "@melog/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useAppStore();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleNicknameSubmit = () => {
    // 유효성 검사
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요");
      return;
    }

    if (nickname.trim().length < 2) {
      setError("닉네임은 2글자 이상 입력해주세요");
      return;
    }

    if (nickname.trim().length > 10) {
      setError("닉네임은 10글자 이하로 입력해주세요");
      return;
    }

    // 특수문자 제한 (일부만 허용)
    const specialCharRegex = /[#%&]/;
    if (specialCharRegex.test(nickname)) {
      setError("특수문자 #, %, &는 사용할 수 없습니다");
      return;
    }

    // 유효한 경우 사용자 정보 저장
    setUser({ name: nickname.trim() });
    setError("");

    // 홈 화면으로 이동
    router.push("/emotion");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNicknameSubmit();
    }
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center px-4 py-6">
          <button
            onClick={() => router.back()}
            className="w-6 h-6 flex items-center justify-center"
          >
            <span className="text-2xl">←</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          {/* Main Illustration */}
          <div className="w-36 h-36 bg-gray-300 rounded-lg mb-8 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl font-semibold text-center text-black mb-4 leading-tight">
            닉네임을
            <br />
            입력해주세요
          </h1>

          {/* Subtitle */}
          <p className="text-base text-center text-black mb-8 leading-6">
            서비스를 이용하기 위해 닉네임을 설정해주세요
          </p>

          {/* Nickname Input */}
          <div className="w-full max-w-sm space-y-4">
            <Input
              type="text"
              placeholder="닉네임을 입력하세요 (2~10자)"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError(""); // 입력 시 에러 메시지 초기화
              }}
              onKeyPress={handleKeyPress}
              className="w-full"
              maxLength={10}
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleNicknameSubmit}
              disabled={!nickname.trim()}
              className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-200 disabled:text-gray-400 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
