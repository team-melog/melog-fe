'use client';

import { Layout, LeftIcon } from '@melog/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { intensityLabels } from '@melog/shared';
import { useAppStore } from '@melog/shared';
import { svgComponents } from '@/assets/svgs/EmotionSvg';
import { useEmotionStore } from '@/features/store';
import { emotionIconsByStep } from '@/entities/emotion/types';

function EmotionInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppStore(state => state.user);
  const { setTextarea, setRecordedAudio } = useEmotionStore();

  // URL 파라미터에서 선택한 감정 정보 가져오기
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = searchParams.get('intensity');
  const selectedColor = searchParams.get('color');

  const selectedIconId =
    emotionIconsByStep[selectedEmotion as keyof typeof emotionIconsByStep]?.[
      Number(selectedIntensity) - 1
    ];

  const SvgComponent = selectedIconId ? svgComponents[selectedIconId] : null;

  const handleVoiceSelect = async () => {
    if (selectedEmotion) {
      // 선택된 감정 정보를 URL 파라미터로 전달
      const params = new URLSearchParams({
        emotion: selectedEmotion,
        intensity: selectedIntensity || '',
        color: selectedColor || '',
      });
      setTextarea('');
      router.push(`/emotion/record?${params.toString()}`);
    }
  };

  const handleTextSelect = async () => {
    if (selectedEmotion) {
      // 선택된 감정 정보를 URL 파라미터로 전달
      const params = new URLSearchParams({
        emotion: selectedEmotion,
        intensity: selectedIntensity || '',
        color: selectedColor || '',
      });
      setRecordedAudio(null);
      router.push(`/emotion/write?${params.toString()}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-svh bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center py-3">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center"
          >
            <LeftIcon />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-between px-4 pt-1">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-meetme text-black leading-tight">
              왜&nbsp;
              {selectedEmotion ? (
                <span>
                  {selectedIntensity &&
                    intensityLabels[Number(selectedIntensity) - 1]}
                  &nbsp;
                  {selectedEmotion}
                </span>
              ) : (
                <div className="w-20 h-[2px] bg-[#060607] ml-2"></div>
              )}
              색을 골랐나요?
              <br />
              {user?.name || '사용자'}님의 이야기를 들려주세요
            </h1>
          </div>

          <div>
            <div className="w-[150px] h-[150px] flex items-center justify-center mb-4">
              {SvgComponent && <SvgComponent width={150} height={150} />}
            </div>

            <div className="text-center text-gray-500 mb-12">
              <p className="text-xl font-meetme leading-tight">
                AI가 이야기를 분석하고
                <br />
                진짜 감정을 찾아줄게요
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="w-full space-y-4 mb-4">
              {/* Voice Recording Option */}
              <button
                onClick={handleVoiceSelect}
                className={`w-full py-3 px-8 rounded-3xl transition-colors text-xl font-meetme bg-[#060607] text-white hover:bg-[#1a1a1a]`}
              >
                음성으로 녹음하기
              </button>

              {/* Text Input Option */}
              <button
                onClick={handleTextSelect}
                className={`w-full py-3 px-8 rounded-3xl transition-colors text-xl font-meetme border border-[#060607] text-[#060607] hover:bg-[#060607] hover:text-white`}
              >
                텍스트로 기록하기
              </button>
            </div>
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
