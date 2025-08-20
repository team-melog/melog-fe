'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@melog/ui';
import Blue3 from '@/assets/svgs/emotions/Blue3';
import SuspenseWrapper from '@/components/SuspenseWrapper';

function NoResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = searchParams.get('intensity');
  const selectedColor = searchParams.get('color');

  const handleRetryRecording = () => {
    if (selectedEmotion && selectedIntensity && selectedColor) {
      const params = new URLSearchParams({
        emotion: selectedEmotion,
        intensity: selectedIntensity,
        color: selectedColor,
      });
      router.push(`/emotion/input?${params.toString()}`);
    } else {
      router.push(`/emotion/skip`);
    }
  };

  const handleGoHome = () => {
    router.push('/emotion');
  };

  return (
    <Layout showTabBar={false}>
      <div className="font-meetme min-h-svh bg-white flex flex-col items-center justify-around">
        <div className="flex flex-col items-center justify-center gap-10 mt-10">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[32px] text-center font-normal text-[#060607] tracking-[-0.32px] leading-[38.4px] mb-4">
              AI가 내용을 감지하지 못했어요 <br />
              다시 기록하시겠어요?
            </h1>
          </div>
          {/* 감정 이미지 */}
          <div className="w-20 h-20">
            <Blue3 width={80} height={80} />
          </div>
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={handleRetryRecording}
            className="w-full bg-[#060607] text-white font-normal text-[20px] py-3 rounded-[30px] tracking-[-0.2px] leading-6 transition-colors"
          >
            다시 기록하기
          </button>

          <button
            onClick={handleGoHome}
            className="w-full text-[#36393f] font-normal text-[20px] py-3 tracking-[-0.2px] leading-6 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default function NoResultPage() {
  return (
    <SuspenseWrapper>
      <NoResultContent />
    </SuspenseWrapper>
  );
}
