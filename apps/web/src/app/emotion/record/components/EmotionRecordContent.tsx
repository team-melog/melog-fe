'use client';

import LottieRecordLoading from '@/components/lotties/LottieRecordLoading';
import {
  Layout,
  MicrophoneIcon,
  CloseXIcon,
  CheckDefaultIcon,
} from '@melog/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useEmotionStore } from '@/features/store';
import { useReactMediaRecorder } from 'react-media-recorder';
import SuspenseWrapper from '@/components/SuspenseWrapper';

function EmotionRecordContentInner() {
  const router = useRouter();
  const [transcription] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(60); // 1분(60초)에서 시작

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    video: false,
    audio: true,
    blobPropertyBag: { type: 'audio/wav' },
    onStop: (blobUrl, blob) => {
      // blob은 이미 Blob 객체입니다
      setRecordedAudio(blob);
    },
  });

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'recording' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // 시간이 다 되면 자동으로 녹음 중지
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, timeLeft, stopRecording]);

  // 녹음 시작 시 타이머 리셋
  useEffect(() => {
    if (status === 'recording') {
      setTimeLeft(60);
    }
  }, [status]);

  // 시간 포맷팅 함수
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // URL 파라미터에서 선택한 감정 정보 가져오기
  const searchParams = useSearchParams();
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = searchParams.get('intensity');
  const selectedColor = searchParams.get('color');

  const { setRecordedAudio } = useEmotionStore();

  const handleFinishRecording = async () => {
    await handleStopRecording();
    // console.log('audioBlob', audioBlob);

    // 녹음된 오디오가 있으면 analysis 페이지로 이동
    // if (audioBlob) {
    // setStoreTranscription(transcription);
    if (selectedEmotion) {
      // 선택된 감정 정보를 URL 파라미터로 전달
      const params = new URLSearchParams({
        emotion: selectedEmotion,
        intensity: selectedIntensity || '',
        color: selectedColor || '',
      });
      router.push(`/emotion/analysis?${params.toString()}`);
    }
    // } else {
    //   // 녹음된 오디오가 없으면 no-result 페이지로
    //   if (selectedEmotion) {
    //     const params = new URLSearchParams({
    //       emotion: selectedEmotion,
    //       intensity: selectedIntensity || '',
    //       color: selectedColor || '',
    //     });
    //     router.push(`/emotion/no-result?${params.toString()}`);
    //   }
    // }
  };

  const handleBack = () => {
    stopRecording();
    // resetRecording();
    router.back();
  };

  const handleStopRecording = async () => {
    stopRecording();
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-svh bg-[#111416] flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-around px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-meetme text-center text-white mb-4">
              목소리를 듣고 있어요
            </h1>

            {/* Timer */}
            <div className="text-2xl font-meetme text-[#dddddd] mb-12">
              {status === 'recording' ? formatTime(timeLeft) : '일시정지됨'}
            </div>
          </div>

          {/* Audio Visualization */}
          <div className="flex w-20 h-20">
            <LottieRecordLoading />
          </div>

          {/* Recording Controls */}
          <div className="flex items-center space-x-8 mb-8">
            <button
              onClick={handleBack}
              className="w-[42px] h-[42px] flex items-center justify-center bg-[#ECEDEF] rounded-full"
            >
              <CloseXIcon color="#171719" />
            </button>

            {/* Main Record/Pause Button */}
            <button
              onClick={
                status === 'recording' ? handleStopRecording : startRecording
              }
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center"
            >
              {status === 'recording' ? (
                <div className="flex space-x-1">
                  <div className="w-3 h-7 bg-black"></div>
                  <div className="w-3 h-7 bg-black"></div>
                </div>
              ) : (
                <MicrophoneIcon color="black" />
              )}
            </button>

            <button
              onClick={handleFinishRecording}
              className="w-[42px] h-[42px] flex items-center justify-center bg-[#2CFFA9] rounded-full"
            >
              <CheckDefaultIcon width={24} height={24} color="black" />
            </button>
          </div>

          {/* Real-time Transcription Display */}
          {transcription && (
            <div className="w-full max-w-sm bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300">
                <strong>실시간 음성 인식:</strong>
              </p>
              <p className="text-sm text-gray-400 mt-2">{transcription}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function EmotionRecordContent() {
  return (
    <SuspenseWrapper>
      <EmotionRecordContentInner />
    </SuspenseWrapper>
  );
}
