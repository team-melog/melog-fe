'use client';

import { Layout } from '@melog/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { intensityLabels } from '@melog/shared';
import { useAppStore } from '@melog/shared';

function EmotionInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppStore(state => state.user);
  const [selectedOption, setSelectedOption] = useState<'voice' | 'text' | null>(
    null
  );

  // URL 파라미터에서 선택한 감정 정보 가져오기
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = searchParams.get('intensity');

  const handleVoiceSelect = () => {
    setSelectedOption('voice');
    // 녹음 화면으로 이동
    router.push('/emotion/record');
  };

  const handleTextSelect = () => {
    setSelectedOption('text');
    // 텍스트 입력 화면으로 이동
    router.push('/emotion/write');
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
          {/* Title */}
          <h1 className="text-2xl font-semibold text-center text-black mb-12 leading-tight">
            왜{' '}
            {selectedIntensity &&
              intensityLabels[parseInt(selectedIntensity) - 1]}{' '}
            {selectedEmotion || '_____'} 을 골랐나요?
            <br />
            {user?.name || '사용자'} 님의 이야기를 듣고 싶어요
          </h1>

          {/* Selection Options */}
          <div className="flex space-x-8 mb-12">
            {/* Voice Recording Option */}
            <button
              onClick={handleVoiceSelect}
              className={`flex flex-col items-center space-y-4 transition-all ${
                selectedOption === 'voice' ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
                  selectedOption === 'voice'
                    ? 'bg-gray-400'
                    : 'bg-gray-300 hover:bg-gray-350'
                }`}
              >
                <span className="text-2xl">🎤</span>
              </div>
              <span className="text-xl font-semibold text-black">녹음</span>
            </button>

            {/* Text Input Option */}
            <button
              onClick={handleTextSelect}
              className={`flex flex-col items-center space-y-4 transition-all ${
                selectedOption === 'text' ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
                  selectedOption === 'text'
                    ? 'bg-gray-400'
                    : 'bg-gray-300 hover:bg-gray-350'
                }`}
              >
                <span className="text-2xl">✏️</span>
              </div>
              <span className="text-xl font-semibold text-black">텍스트</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center text-gray-600 max-w-xs">
            <p className="text-sm">
              AI가 이야기를 분석하고
              <br />
              진짜 감정을 찾아줄게요
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function EmotionInputPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmotionInputContent />
    </Suspense>
  );
}
