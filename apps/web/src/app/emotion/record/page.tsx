"use client";

import { Layout } from "@melog/ui";
import { AudioRecorder } from "@melog/ui";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EmotionRecordPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60초 (1분)
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeLeft(60);
  };

  const handlePauseRecording = () => {
    setIsRecording(false);
  };

  const handleDeleteRecording = () => {
    setRecordedAudio(null);
    setTranscription("");
    setTimeLeft(60);
    setIsRecording(false);
  };

  const handleSaveRecording = () => {
    // 녹음 완료 후 감정 분석 화면으로 이동
    router.push("/emotion/analysis");
  };

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
  };

  const handleAudioError = (error: string) => {
    console.error("음성 인식 오류:", error);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center py-6">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center"
          >
            <span className="text-2xl">←</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Status Text */}
          <h1 className="text-2xl font-semibold text-center text-black mb-4">
            듣고 있어요..
          </h1>

          {/* Timer */}
          <div className="text-xl font-semibold text-black mb-8">
            {formatTime(timeLeft)}
          </div>

          {/* Main Illustration */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-36 h-36 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">🎙️</span>
            </div>
            <p className="text-base font-semibold text-black text-center">
              일러스트
              <br />
              혹은 애니메이션
            </p>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center space-x-8 mb-8">
            {/* Delete Button */}
            <button
              onClick={handleDeleteRecording}
              className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center"
            >
              <span className="text-sm font-semibold text-black">삭제</span>
            </button>

            {/* Main Record/Pause Button */}
            <button
              onClick={
                isRecording ? handlePauseRecording : handleStartRecording
              }
              className="w-24 h-24 bg-gray-400 rounded-full flex items-center justify-center"
            >
              {isRecording ? (
                <span className="text-2xl">⏸️</span>
              ) : (
                <span className="text-2xl">🎤</span>
              )}
            </button>

            {/* Save Button */}
            <button
              onClick={handleSaveRecording}
              disabled={!recordedAudio && !isRecording}
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                recordedAudio || isRecording
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <span className="text-sm font-semibold text-black">저장</span>
            </button>
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
            <div className="w-full max-w-sm bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>음성 인식 결과:</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">{transcription}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
