'use client';

import { Layout, LeftIcon, MicrophoneIcon } from '@melog/ui';
import { AudioRecorder } from '@melog/ui';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EmotionRecordPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60초 (1분)
  // const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRecording(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, timeLeft]);

  // 시간을 MM:SS 형식으로 변환
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeLeft(60);
  };

  const handlePauseRecording = () => {
    setIsRecording(false);
  };

  // const handleDeleteRecording = () => {
  //   setRecordedAudio(null);
  //   setTranscription('');
  //   setTimeLeft(60);
  //   setIsRecording(false);
  // };

  const handleFinishRecording = () => {
    // 녹음 완료 후 감정 분석 화면으로 이동
    router.push('/emotion/analysis');
  };

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
  };

  const handleAudioError = (error: string) => {
    console.error('음성 인식 오류:', error);
  };

  const handleBack = () => {
    router.back();
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
        <div className="flex-1 flex flex-col items-center justify-between px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-meetme text-center text-white mb-4">
              목소리를 듣고 있어요
            </h1>

            {/* Timer */}
            <div className="text-2xl font-meetme text-[#dddddd] mb-12">
              {isRecording ? formatTime(timeLeft) : '일시정지됨'}
            </div>
          </div>

          {/* Audio Visualization */}
          <div className="flex items-end space-x-2 mb-12">
            <div className="w-4 h-12 bg-[#6bfcc1] rounded-lg"></div>
            <div className="w-4 h-8 bg-[#fff471] rounded-lg"></div>
            <div className="w-4 h-8 bg-[#ffbbdd] rounded-lg"></div>
            <div className="w-4 h-8 bg-[#6ba1db] rounded-lg"></div>
            <div className="w-4 h-6 bg-[#fff471] rounded-lg"></div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center space-x-8 mb-8">
            {/* Delete Button */}
            {/* <button
              onClick={handleDeleteRecording}
              className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-sm font-semibold text-white">삭제</span>
            </button> */}

            {/* Main Record/Pause Button */}
            <button
              onClick={
                isRecording ? handlePauseRecording : handleStartRecording
              }
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center"
            >
              {isRecording ? (
                <div className="flex space-x-1">
                  <div className="w-3 h-7 bg-black"></div>
                  <div className="w-3 h-7 bg-black"></div>
                </div>
              ) : (
                <MicrophoneIcon color="black" />
              )}
            </button>

            {/* Save Button */}
            {/* <button
              onClick={handleFinishRecording}
              disabled={!recordedAudio && !isRecording}
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                recordedAudio || isRecording
                  ? 'bg-gray-600 hover:bg-gray-500'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              <span className="text-sm font-semibold text-white">저장</span>
            </button> */}
          </div>

          {/* Audio Recorder Component (Hidden but functional) */}
          <div className="hidden">
            <AudioRecorder
              onTranscriptionComplete={handleTranscriptionComplete}
              onError={handleAudioError}
              maxDuration={60}
            />
          </div>

          {/* Transcription Display */}
          {transcription && (
            <div className="w-full max-w-sm bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300">
                <strong>음성 인식 결과:</strong>
              </p>
              <p className="text-sm text-gray-400 mt-2">{transcription}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
