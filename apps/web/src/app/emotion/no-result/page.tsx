'use client';

import { useRouter } from 'next/navigation';
import { Layout } from '@melog/ui';

export default function NoResultPage() {
  const router = useRouter();

  const handleRetryRecording = () => {
    router.push('/emotion/record');
  };

  const handleGoHome = () => {
    router.push('/emotion');
  };

  return (
    <Layout showTabBar={false}>
      <div className="font-meetme min-h-svh bg-white flex flex-col items-center justify-around px-4">
        <div className="flex flex-col items-center justify-center gap-10 mt-10">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[32px] text-center font-normal text-[#060607] tracking-[-0.32px] leading-[38.4px] mb-4">
              녹음된 음성을 감지하지 못했어요 <br />
              다시 녹음하시겠어요?
            </h1>
          </div>
          {/* 감정 이미지 */}
          <div className="w-20 h-20">
            <div className="w-20 h-20 bg-blue-500"></div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={handleRetryRecording}
            className="w-full bg-[#060607] text-white font-normal text-[20px] py-3 rounded-[30px] tracking-[-0.2px] leading-6 hover:bg-[#2a2a2a] transition-colors"
          >
            다시 녹음하기
          </button>

          <button
            onClick={handleGoHome}
            className="w-full text-[#36393f] font-normal text-[20px] py-3 tracking-[-0.2px] leading-6 hover:text-[#060607] transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </Layout>
  );
}
