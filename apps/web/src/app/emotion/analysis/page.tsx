'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@melog/ui';
import { useEmotionStore } from '@/features/store';
import { useAppStore } from '@/features/store';
import { useCreateEmotionRecordTXT } from '@/features/emotion';
import { LottieSelectCharacters } from '@/components/lotties';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import makeAudioFile from '@/shared/utils/makeAudioFile';
import { API_ENDPOINTS, apiClient } from '@/shared';

function EmotionAnalysisContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = searchParams.get('intensity');
  const selectedColor = searchParams.get('color');

  const [, setIsAnalyzing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeLeft, setTimeLeft] = useState(5); // 테스트용 5초
  const [isLoading, setIsLoading] = useState(false);

  // Strict Mode에서 중복 실행 방지를 위한 ref
  const hasAnalyzed = useRef(false);

  // 5초 카운트다운

  const { setAnalysisResult } = useEmotionStore();
  const user = useAppStore(state => state.user);
  const { recordedAudio, textarea, clearRecording } = useEmotionStore();
  const { mutateAsync: createRecordTXT } = useCreateEmotionRecordTXT();

  useEffect(() => {
    if (isLoading) return;

    // 이미 분석이 실행되었으면 중단
    if (hasAnalyzed.current) {
      return;
    }

    // 녹음된 오디오나 텍스트가 있을 때만 분석 실행
    if (!recordedAudio && !textarea) return;

    // 분석 실행 표시
    hasAnalyzed.current = true;

    // 감정 분석 실행
    performEmotionAnalysis();

    // const interval = setInterval(() => {
    //   setTimeLeft(prev => {
    //     if (prev <= 1) {
    //       // 5초 후 감정 분석 결과 화면으로 이동
    //       if (selectedEmotion) {
    //         const params = new URLSearchParams({
    //           emotion: selectedEmotion,
    //           intensity: selectedIntensity || '',
    //           color: selectedColor || '',
    //         });
    //         router.push(`/emotion/result?${params.toString()}`);
    //       }
    //       return 0;
    //     }
    //     return prev - 1;
    //   });
    // }, 1000);
    // return () => clearInterval(interval); // 테스트용 5초 후 감정 분석 결과 화면으로 이동
    // router.push(`/emotion/result?${savedParams.toString()}`);
  }, []); // 빈 의존성 배열로 변경하여 컴포넌트 마운트 시에만 실행

  const createEmotionSTT = async () => {
    try {
      const audioFile = makeAudioFile(recordedAudio as Blob, user.name);
      const formData = new FormData();

      formData.append('audioFile', audioFile);

      // userSelectedEmotion을 개별 필드로 분리해서 추가
      if (selectedEmotion && selectedIntensity) {
        const userSelectedEmotion = {
          type: selectedEmotion,
          percentage: 20 * Number(selectedIntensity),
        };
        formData.append(
          'userSelectedEmotion',
          JSON.stringify(userSelectedEmotion)
        );
      }

      const result = await apiClient.post(
        API_ENDPOINTS.EMOTION.STT.replace(':nickname', user.name),
        formData
      );
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  const performEmotionAnalysis = async () => {
    if (isLoading) return; // 이미 분석 중이면 중단
    if (hasAnalyzed.current === false) return; // useEffect에서 실행되지 않았으면 중단

    setIsLoading(true);
    try {
      setIsAnalyzing(true);
      let result = null;
      if (recordedAudio) {
        // const audioFile = makeAudioFile(recordedAudio as Blob, user.name);
        // result = await createRecordSTT({
        //   nickname: user.name,
        //   request: {
        //     audioFile: audioFile,
        //     userSelectedEmotion: {
        //       type: selectedEmotion,
        //       percentage: 20 * Number(selectedIntensity),
        //     },
        //   },
        // });
        result = await createEmotionSTT();
      }
      if (textarea) {
        result = await createRecordTXT({
          nickname: user.name,
          request: {
            text: textarea,
            ...(selectedEmotion &&
              selectedIntensity && {
                userSelectedEmotion: {
                  type: selectedEmotion,
                  percentage: 20 * Number(selectedIntensity),
                },
              }),
          },
        });
      }

      setAnalysisResult(result);
      // 분석 완료 후 녹음 데이터 정리
      clearRecording();
      if (result) {
        if (selectedEmotion && selectedIntensity && selectedColor) {
          const params = new URLSearchParams({
            emotion: selectedEmotion,
            intensity: selectedIntensity,
            color: selectedColor,
          });
          router.push(`/emotion/result?${params.toString()}`);
        } else {
          router.push(`/emotion/result`);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  // if (analysisResult?.error) {
  //   return (
  //     <Layout showTabBar={false}>
  //       <div className="font-meetme min-h-svh bg-[#111416] flex flex-col">
  //         {/* Main Content */}
  //         <div className="flex-1 flex flex-col items-center justify-center px-4">
  //           <div className="text-white text-xl font-meetme mb-4">
  //             분석 중 오류가 발생했습니다
  //           </div>

  //           <button
  //             onClick={() => router.back()}
  //             className="bg-[#ff9292] text-white px-6 py-3 rounded-lg font-meetme"
  //           >
  //             다시 녹음하기
  //           </button>
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }

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
