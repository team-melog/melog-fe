'use client';

import { Layout, LeftIcon } from '@melog/ui';
import { useAppStore } from '@melog/shared';
import { useRouter } from 'next/navigation';

export default function EmotionSkipPage() {
  const router = useRouter();
  const { user } = useAppStore();

  const handleVoiceSelect = () => {
    // 녹음 화면으로 이동
    router.push('/emotion/record');
  };

  const handleTextSelect = () => {
    // 텍스트 입력 화면으로 이동
    router.push('/emotion/write');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={false}>
      <div className="font-meetme bg-white flex flex-col min-h-svh">
        {/* Header */}
        <div className="flex items-center py-3">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center"
          >
            <LeftIcon />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Title */}
          <h1 className="text-3xl font-normal text-center text-[#060607] mb-12 leading-tight tracking-[-0.32px]">
            잘 모르겠다면,
            <br />
            {user?.name || '사용자'}님의 이야기를 먼저 듣고
            <br />
            감정을 분석해 드릴게요
          </h1>
        </div>

        {/* Bottom Buttons */}
        <div className="px-4 pb-8 space-y-4">
          {/* Instructions */}
          <div className="text-center text-[#656a76] mb-6">
            <p className="text-2xl font-normal leading-tight tracking-[-0.22px]">
              AI가 이야기를 분석하고
              <br />
              진짜 감정을 찾아줄게요
            </p>
          </div>
          {/* Voice Recording Button */}
          <button
            onClick={handleVoiceSelect}
            className="w-full bg-[#060607] text-white font-normal text-xl py-3 rounded-[30px] tracking-[-0.2px]"
          >
            음성으로 녹음하기
          </button>

          {/* Text Input Button */}
          <button
            onClick={handleTextSelect}
            className="w-full border border-[#060607] text-[#060607] font-normal text-xl py-3 rounded-[30px] tracking-[-0.2px]"
          >
            텍스트로 기록하기
          </button>
        </div>
      </div>
    </Layout>
  );
}
