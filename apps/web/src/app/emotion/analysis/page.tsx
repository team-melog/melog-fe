'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@melog/ui';
import { useEmotionStore } from '@/features/store';
import { useAppStore } from '@melog/shared';
import { useCreateEmotionRecord } from '@/features/emotion';
import { LottieSelectCharacters } from '@/components/lotties';
import SuspenseWrapper from '@/components/SuspenseWrapper';

function EmotionAnalysisContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = searchParams.get('intensity');
  const selectedColor = searchParams.get('color');

  const [, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    success?: boolean;
    data?: unknown;
    error?: string;
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeLeft, setTimeLeft] = useState(5); // 테스트용 5초

  // 5초 카운트다운

  const user = useAppStore(state => state.user);
  const { recordedAudio, textarea, clearRecording } = useEmotionStore();
  const { mutateAsync: createRecord } = useCreateEmotionRecord();

  useEffect(() => {
    // 녹음된 오디오 정보 확인
    // if (!recordedAudio) {
    //   // 녹음 정보가 없으면 record 페이지로 리다이렉트
    //   router.push(`/emotion/record?${savedParams.toString()}`);
    //   return;
    // }

    // 감정 분석 실행
    performEmotionAnalysis();

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // 5초 후 감정 분석 결과 화면으로 이동
          if (selectedEmotion) {
            const params = new URLSearchParams({
              emotion: selectedEmotion,
              intensity: selectedIntensity || '',
              color: selectedColor || '',
            });
            router.push(`/emotion/result?${params.toString()}`);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval); // 테스트용 5초 후 감정 분석 결과 화면으로 이동
    // router.push(`/emotion/result?${savedParams.toString()}`);
  }, [recordedAudio, router]);

  // if (analysisResult && analysisResult.success) {
  //   return router.push(`/emotion/result?${savedParams.toString()}`);
  // }

  const performEmotionAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      // Blob을 File 객체로 변환
      const audioFile = new File([recordedAudio as Blob], 'recording.webm', {
        type: recordedAudio?.type || 'audio/webm;codecs=opus',
      });
      const result = await createRecord({
        nickname: user?.name || '',
        request: {
          audioFile: audioFile,
          ...(textarea && { text: textarea }),
          userSelectedEmotion: {
            type: selectedEmotion,
            percentage: 20 * Number(selectedIntensity),
          },
        },
      });

      console.log('감정 분석 결과:', result);
      setAnalysisResult({ success: true, data: result });

      // 분석 완료 후 녹음 데이터 정리
      clearRecording();

      if (selectedEmotion && selectedIntensity && selectedColor) {
        const params = new URLSearchParams({
          emotion: selectedEmotion,
          intensity: selectedIntensity,
          color: selectedColor,
        });
        router.push(`/emotion/result?${params.toString()}`);
      }
    } catch (e) {
      // setAnalysisResult({
      //   success: false,
      //   error: e,
      // });
      setAnalysisResult({ success: true, data: e }); // 테스트용
    } finally {
      setIsAnalyzing(false);
    }
  };

  // if (isAnalyzing) {
  //   return (
  //     <Layout showTabBar={false}>
  //       <div className="font-meetme min-h-svh bg-[#111416] flex flex-col">
  //         {/* Main Content */}
  //         <div className="flex-1 flex flex-col items-center justify-center px-4">
  //           {/* Title */}
  //           <h1 className="text-3xl font-meetme text-center text-white mb-4">
  //             AI가 감정을 분석중이에요
  //           </h1>

  //           <div className="text-2xl font-meetme text-center text-[#a5a5a5] mb-12">
  //             조금만 기다려 주세요
  //           </div>

  //           {/* Loading Animation */}
  //           <div className="flex flex-col items-center mb-12 mt-6">
  //             <div className="w-[100px] h-[100px] flex items-center justify-center">
  //               <LottieSelectCharacters />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }

  if (analysisResult?.error) {
    return (
      <Layout showTabBar={false}>
        <div className="font-meetme min-h-svh bg-[#111416] flex flex-col">
          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-white text-xl font-meetme mb-4">
              분석 중 오류가 발생했습니다
            </div>

            <button
              onClick={() => router.back()}
              className="bg-[#ff9292] text-white px-6 py-3 rounded-lg font-meetme"
            >
              다시 녹음하기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

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

export default function EmotionAnalysisPage() {
  return (
    <SuspenseWrapper>
      <EmotionAnalysisContent />
    </SuspenseWrapper>
  );
}
