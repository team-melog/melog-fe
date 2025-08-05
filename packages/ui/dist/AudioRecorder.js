'use client';
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime';
import { useState } from 'react';
import { useAudioRecorder, convertSpeechToTextWithRetry } from '@melog/shared';
import Button from './Button';
export default function AudioRecorder({
  onTranscriptionComplete,
  onError,
  maxDuration = 60,
  className = '',
}) {
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
  const formatTime = seconds => {
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
  const handleTextEdit = e => {
    updateRealtimeText(e.target.value);
  };
  const displayError =
    recordingError ||
    (transcribedText === '' && audioBlob && !isTranscribing ? null : null);
  return _jsxs('div', {
    className: `w-full space-y-4 ${className}`,
    children: [
      _jsxs('div', {
        className: 'text-center',
        children: [
          _jsx('h3', {
            className: 'text-base font-semibold text-gray-800 mb-1',
            children: '\uC74C\uC131 \uBA54\uBAA8',
          }),
          _jsxs('p', {
            className: 'text-xs text-gray-600',
            children: [
              '\uCD5C\uB300 ',
              maxDuration,
              '\uCD08\uAE4C\uC9C0 \uB179\uC74C\uD560 \uC218 \uC788\uC5B4\uC694',
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'w-full bg-gray-200 rounded-full h-2',
        children: _jsx('div', {
          className: `h-2 rounded-full transition-all duration-300 ${
            progress > 90
              ? 'bg-red-500'
              : progress > 70
                ? 'bg-yellow-500'
                : 'bg-blue-500'
          }`,
          style: { width: `${Math.min(progress, 100)}%` },
        }),
      }),
      _jsxs('div', {
        className: 'text-center',
        children: [
          _jsx('span', {
            className: `text-2xl font-mono ${recordingTime > maxDuration * 0.9 ? 'text-red-500' : 'text-gray-700'}`,
            children: formatTime(recordingTime),
          }),
          _jsxs('span', {
            className: 'text-sm text-gray-500 ml-2',
            children: ['/ ', formatTime(maxDuration)],
          }),
        ],
      }),
      isRecording &&
        _jsxs('div', {
          className: 'space-y-2',
          children: [
            _jsxs('div', {
              className:
                'flex items-center justify-center space-x-2 text-red-500',
              children: [
                _jsx('div', {
                  className: 'w-3 h-3 bg-red-500 rounded-full animate-pulse',
                }),
                _jsx('span', {
                  className: 'text-sm font-medium',
                  children: isPaused ? '일시정지됨' : '녹음 중...',
                }),
                isListening &&
                  _jsx('span', {
                    className: 'text-xs text-blue-600 ml-2',
                    children: '\uD83C\uDFA4 \uC778\uC2DD \uC911',
                  }),
              ],
            }),
            (realtimeText || interimText) &&
              _jsxs('div', {
                className: 'bg-blue-50 border border-blue-200 rounded-lg p-3',
                children: [
                  _jsx('div', {
                    className: 'text-xs text-blue-700 mb-1',
                    children:
                      '\uD83D\uDDE3\uFE0F \uC2E4\uC2DC\uAC04 \uC778\uC2DD \uB0B4\uC6A9',
                  }),
                  _jsx('textarea', {
                    value: realtimeText,
                    onChange: handleTextEdit,
                    className:
                      'w-full bg-transparent text-sm text-blue-800 resize-none border-none outline-none',
                    placeholder:
                      '\uC74C\uC131\uC774 \uC778\uC2DD\uB418\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4...',
                    rows: Math.max(2, Math.ceil(realtimeText.length / 30)),
                  }),
                  interimText &&
                    _jsxs('div', {
                      className: 'text-xs text-blue-500 italic opacity-70 mt-1',
                      children: [interimText, '...'],
                    }),
                ],
              }),
          ],
        }),
      _jsx('div', {
        className: 'space-y-3',
        children: !audioBlob
          ? // 녹음 전/중 버튼들
            _jsx('div', {
              className: 'flex space-x-2',
              children: !isRecording
                ? _jsx(Button, {
                    onClick: startRecording,
                    className: 'flex-1',
                    disabled: isTranscribing,
                    children: '\uD83C\uDFA4 \uB179\uC74C \uC2DC\uC791',
                  })
                : _jsxs(_Fragment, {
                    children: [
                      _jsx(Button, {
                        onClick: isPaused ? resumeRecording : pauseRecording,
                        variant: 'outline',
                        className: 'flex-1',
                        children: isPaused ? '▶️ 재개' : '⏸️ 일시정지',
                      }),
                      _jsx(Button, {
                        onClick: stopRecording,
                        variant: 'secondary',
                        className: 'flex-1',
                        children: '\u23F9\uFE0F \uC815\uC9C0',
                      }),
                    ],
                  }),
            })
          : // 녹음 완료 후 버튼들
            _jsxs('div', {
              className: 'space-y-2',
              children: [
                _jsxs('div', {
                  className: 'flex space-x-2',
                  children: [
                    _jsx(Button, {
                      onClick: playRecording,
                      variant: 'outline',
                      className: 'flex-1',
                      disabled: isTranscribing,
                      children: '\u25B6\uFE0F \uC7AC\uC0DD',
                    }),
                    _jsx(Button, {
                      onClick: handleNewRecording,
                      variant: 'outline',
                      className: 'flex-1',
                      disabled: isTranscribing,
                      children: '\uD83D\uDD04 \uB2E4\uC2DC \uB179\uC74C',
                    }),
                  ],
                }),
                _jsx(Button, {
                  onClick: handleTranscribe,
                  className: 'w-full',
                  disabled: isTranscribing,
                  isLoading: isTranscribing,
                  children: isTranscribing
                    ? '음성 인식 중...'
                    : realtimeText.trim()
                      ? '📝 실시간 텍스트 사용'
                      : '📝 텍스트로 변환',
                }),
              ],
            }),
      }),
      recordingError &&
        _jsx('div', {
          className: 'bg-red-50 border border-red-200 rounded-lg p-3',
          children: _jsxs('p', {
            className: 'text-sm text-red-700 text-center',
            children: ['\u26A0\uFE0F ', recordingError],
          }),
        }),
      transcribedText &&
        _jsxs('div', {
          className: 'bg-green-50 border border-green-200 rounded-lg p-3',
          children: [
            _jsx('h4', {
              className: 'text-sm font-medium text-green-800 mb-2',
              children: '\uD83D\uDCDD \uBCC0\uD658\uB41C \uD14D\uC2A4\uD2B8:',
            }),
            _jsx('p', {
              className: 'text-sm text-green-700',
              children: transcribedText,
            }),
          ],
        }),
      !isRecording &&
        !audioBlob &&
        _jsx('div', {
          className: 'bg-blue-50 border border-blue-200 rounded-lg p-3',
          children: _jsx('p', {
            className: 'text-xs text-blue-700 text-center',
            children:
              '\uD83D\uDCA1 \uB9C8\uC774\uD06C \uC811\uADFC \uAD8C\uD55C\uC744 \uD5C8\uC6A9\uD574\uC8FC\uC138\uC694. \uB179\uC74C\uD558\uBA74 \uC2E4\uC2DC\uAC04\uC73C\uB85C \uB9D0\uD558\uB294 \uB0B4\uC6A9\uC774 \uD14D\uC2A4\uD2B8\uB85C \uBCC0\uD658\uB429\uB2C8\uB2E4.',
          }),
        }),
      !isRecording &&
        audioBlob &&
        realtimeText &&
        _jsxs('div', {
          className: 'bg-green-50 border border-green-200 rounded-lg p-3',
          children: [
            _jsx('h4', {
              className: 'text-sm font-medium text-green-800 mb-2',
              children:
                '\uD83D\uDDE3\uFE0F \uC2E4\uC2DC\uAC04 \uC778\uC2DD \uACB0\uACFC:',
            }),
            _jsx('textarea', {
              value: realtimeText,
              onChange: handleTextEdit,
              className:
                'w-full bg-white border border-green-300 rounded p-2 text-sm text-green-700 resize-none',
              rows: Math.max(2, Math.ceil(realtimeText.length / 30)),
            }),
            _jsx('p', {
              className: 'text-xs text-green-600 mt-1',
              children:
                '\u270F\uFE0F \uB0B4\uC6A9\uC744 \uC218\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.',
            }),
          ],
        }),
    ],
  });
}
