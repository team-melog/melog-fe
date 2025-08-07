'use client';

import { Layout, LeftIcon, MicrophoneIcon } from '@melog/ui';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// import { useAudioRecorder } from '@melog/shared';

export default function EmotionRecordPage() {
  const router = useRouter();
  const [transcription, setTranscription] = useState<string>('');

  // const {
  //   isRecording,
  //   recordingTime,
  //   realtimeText,
  //   // interimText,
  //   startRecording,
  //   stopRecording,
  //   resetRecording,
  // } = useAudioRecorder();

  // 임시 상태 (실제 녹음 기능 주석처리)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [realtimeText, setRealtimeText] = useState('');

  // 시간을 MM:SS 형식으로 변환 (남은 시간 표시)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 남은 시간 계산 (60초 - 녹음 시간)
  const timeLeft = Math.max(0, 60 - recordingTime);

  // 임시 녹음 함수들
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setRealtimeText('');
    setTranscription('');
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const resetRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setRealtimeText('');
    setTranscription('');
  };

  // 임시 타이머 (실제 녹음 기능 주석처리)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording && recordingTime < 60) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (recordingTime >= 60) {
      setIsRecording(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recordingTime]);

  // 실시간 텍스트 업데이트 (임시)
  useEffect(() => {
    if (realtimeText) {
      setTranscription(realtimeText);
    }
  }, [realtimeText]);

  // const handleDeleteRecording = () => {
  //   setRecordedAudio(null);
  //   setTranscription('');
  //   setTimeLeft(60);
  //   setIsRecording(false);
  // };

  const handleFinishRecording = () => {
    // 음성이 없으면 결과 없음 페이지로, 있으면 감정 분석 페이지로 이동
    const trimmedText = transcription.trim();
    console.log('Transcription:', transcription);
    console.log('Trimmed text:', trimmedText);
    console.log('Text length:', trimmedText.length);

    if (!trimmedText || trimmedText.length < 2) {
      // router.push('/emotion/no-result');
      router.push('/emotion/analysis'); //임시
    } else {
      router.push('/emotion/analysis');
    }
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
                isRecording
                  ? () => {
                      stopRecording();
                      resetRecording();
                      setTranscription('');
                    }
                  : startRecording
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

          {/* Real-time Transcription Display */}
          {/* {(realtimeText || interimText) && (
            <div className="w-full max-w-sm bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300">
                <strong>실시간 음성 인식:</strong>
              </p>
              <p className="text-sm text-gray-400 mt-2">{realtimeText}</p>
              {interimText && (
                <p className="text-sm text-gray-500 mt-1 italic">
                  {interimText}...
                </p>
              )}
            </div>
          )} */}
        </div>
      </div>
    </Layout>
  );
}
