'use client';

import LottieRecordLoading from '@/components/lotties/LottieRecordLoading';
import { Layout, LeftIcon, MicrophoneIcon } from '@melog/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useEmotionStore } from '@/features/store';
import { useReactMediaRecorder } from 'react-media-recorder';
import SuspenseWrapper from '@/components/SuspenseWrapper';

function EmotionRecordContentInner() {
  const router = useRouter();
  const [transcription] = useState<string>('');
  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    video: false,
    audio: true,
    blobPropertyBag: { type: 'audio/wav' },
    onStop: (blobUrl, blob) => {
      // blob은 이미 Blob 객체입니다
      setRecordedAudio(blob);
    },
  });

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
        {/* Header */}
        <div className="flex items-center justify-between py-3 px-4">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center"
          >
            <LeftIcon color="white" />
          </button>
          <button
            onClick={handleFinishRecording}
            className="text-[#ff9292] font-meetme text-xl"
          >
            종료하기
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-around px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-meetme text-center text-white mb-4">
              목소리를 듣고 있어요
            </h1>

            {/* Timer */}
            <div className="text-2xl font-meetme text-[#dddddd] mb-12">
              {/* {status?.recording ? formatTime(timeLeft) : '일시정지됨'} */}
            </div>
          </div>

          {/* Audio Visualization */}
          <div className="flex w-20 h-20">
            <LottieRecordLoading />
          </div>

          {/* Recording Controls */}
          <div className="flex items-center space-x-8 mb-8">
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
