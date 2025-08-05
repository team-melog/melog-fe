'use client';

import { useState } from 'react';
import { useAudioRecorder, convertSpeechToTextWithRetry } from '@melog/shared';
import Button from './Button';

interface AudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
  maxDuration?: number;
  className?: string;
}

export default function AudioRecorder({
  onTranscriptionComplete,
  onError,
  maxDuration = 60,
  className = '',
}: AudioRecorderProps) {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    error: recordingError,
    realtimeText,
    isListening,
    interimText,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    playRecording,
    updateRealtimeText,
  } = useAudioRecorder();

  // 시간을 mm:ss 형식으로 포맷
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 진행률 계산
  const progress = (recordingTime / maxDuration) * 100;

  // STT 변환 실행 (실시간 텍스트가 있으면 우선 사용)
  const handleTranscribe = async () => {
    // 실시간 텍스트가 있으면 바로 사용
    if (realtimeText.trim()) {
      setTranscribedText(realtimeText.trim());
      onTranscriptionComplete?.(realtimeText.trim());
      return;
    }

    // 실시간 텍스트가 없으면 기존 STT 서비스 사용
    if (!audioBlob) return;

    setIsTranscribing(true);
    setTranscribedText('');

    try {
      const result = await convertSpeechToTextWithRetry(audioBlob);

      if (result.success && result.text) {
        setTranscribedText(result.text);
        onTranscriptionComplete?.(result.text);
      } else {
        const errorMsg = result.error || '음성 인식에 실패했습니다.';
        onError?.(errorMsg);
      }
    } catch (error) {
      const errorMsg = '음성 인식 중 오류가 발생했습니다.';
      onError?.(errorMsg);
    } finally {
      setIsTranscribing(false);
    }
  };

  // 새로 녹음하기
  const handleNewRecording = () => {
    resetRecording();
    setTranscribedText('');
  };

  // 실시간 텍스트 수동 수정
  const handleTextEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateRealtimeText(e.target.value);
  };

  const displayError =
    recordingError ||
    (transcribedText === '' && audioBlob && !isTranscribing ? null : null);

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* 헤더 */}
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          음성 메모
        </h3>
        <p className="text-xs text-gray-600">
          최대 {maxDuration}초까지 녹음할 수 있어요
        </p>
      </div>

      {/* 진행률 바 */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            progress > 90
              ? 'bg-red-500'
              : progress > 70
                ? 'bg-yellow-500'
                : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* 타이머 */}
      <div className="text-center">
        <span
          className={`text-2xl font-mono ${
            recordingTime > maxDuration * 0.9 ? 'text-red-500' : 'text-gray-700'
          }`}
        >
          {formatTime(recordingTime)}
        </span>
        <span className="text-sm text-gray-500 ml-2">
          / {formatTime(maxDuration)}
        </span>
      </div>

      {/* 녹음 상태 표시 */}
      {isRecording && (
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              {isPaused ? '일시정지됨' : '녹음 중...'}
            </span>
            {isListening && (
              <span className="text-xs text-blue-600 ml-2">🎤 인식 중</span>
            )}
          </div>

          {/* 실시간 텍스트 표시 */}
          {(realtimeText || interimText) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-700 mb-1">
                🗣️ 실시간 인식 내용
              </div>
              <textarea
                value={realtimeText}
                onChange={handleTextEdit}
                className="w-full bg-transparent text-sm text-blue-800 resize-none border-none outline-none"
                placeholder="음성이 인식되면 여기에 표시됩니다..."
                rows={Math.max(2, Math.ceil(realtimeText.length / 30))}
              />
              {interimText && (
                <div className="text-xs text-blue-500 italic opacity-70 mt-1">
                  {interimText}...
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div className="space-y-3">
        {!audioBlob ? (
          // 녹음 전/중 버튼들
          <div className="flex space-x-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="flex-1"
                disabled={isTranscribing}
              >
                🎤 녹음 시작
              </Button>
            ) : (
              <>
                <Button
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  variant="outline"
                  className="flex-1"
                >
                  {isPaused ? '▶️ 재개' : '⏸️ 일시정지'}
                </Button>
                <Button
                  onClick={stopRecording}
                  variant="secondary"
                  className="flex-1"
                >
                  ⏹️ 정지
                </Button>
              </>
            )}
          </div>
        ) : (
          // 녹음 완료 후 버튼들
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Button
                onClick={playRecording}
                variant="outline"
                className="flex-1"
                disabled={isTranscribing}
              >
                ▶️ 재생
              </Button>
              <Button
                onClick={handleNewRecording}
                variant="outline"
                className="flex-1"
                disabled={isTranscribing}
              >
                🔄 다시 녹음
              </Button>
            </div>

            <Button
              onClick={handleTranscribe}
              className="w-full"
              disabled={isTranscribing}
              isLoading={isTranscribing}
            >
              {isTranscribing
                ? '음성 인식 중...'
                : realtimeText.trim()
                  ? '📝 실시간 텍스트 사용'
                  : '📝 텍스트로 변환'}
            </Button>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {recordingError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700 text-center">
            ⚠️ {recordingError}
          </p>
        </div>
      )}

      {/* 변환된 텍스트 */}
      {transcribedText && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            📝 변환된 텍스트:
          </h4>
          <p className="text-sm text-green-700">{transcribedText}</p>
        </div>
      )}

      {/* 도움말 */}
      {!isRecording && !audioBlob && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700 text-center">
            💡 마이크 접근 권한을 허용해주세요. 녹음하면 실시간으로 말하는
            내용이 텍스트로 변환됩니다.
          </p>
        </div>
      )}

      {/* 녹음 완료 후 실시간 텍스트가 있을 때 */}
      {!isRecording && audioBlob && realtimeText && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            🗣️ 실시간 인식 결과:
          </h4>
          <textarea
            value={realtimeText}
            onChange={handleTextEdit}
            className="w-full bg-white border border-green-300 rounded p-2 text-sm text-green-700 resize-none"
            rows={Math.max(2, Math.ceil(realtimeText.length / 30))}
          />
          <p className="text-xs text-green-600 mt-1">
            ✏️ 내용을 수정할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
