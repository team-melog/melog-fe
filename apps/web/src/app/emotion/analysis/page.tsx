'use client';

import { useEffect, useState } from 'react';
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

  // 5초 카운트다운

  const { setAnalysisResult } = useEmotionStore();
  const user = useAppStore(state => state.user);
  const { recordedAudio, textarea, clearRecording } = useEmotionStore();
  const { mutateAsync: createRecordTXT } = useCreateEmotionRecordTXT();

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
      console.log('===', result);
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  const performEmotionAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      // Blob을 File 객체로 변환
      let result = null;
      // setAnalysisResult(null);
      console.log('analysis', recordedAudio, textarea);
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
        console.log('stt res', result);
      }
      if (textarea) {
        result = await createRecordTXT({
          nickname: user.name,
          request: {
            text: textarea,
            userSelectedEmotion: {
              type: selectedEmotion,
              percentage: 20 * Number(selectedIntensity),
            },
          },
        });
      }

      console.log('감정 분석 결과:', result);

      setAnalysisResult(result);
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
      console.error(e);
    } finally {
      setIsAnalyzing(false);
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
