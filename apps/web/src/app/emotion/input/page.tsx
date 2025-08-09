'use client';

import { Layout, LeftIcon } from '@melog/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { intensityLabels } from '@melog/shared';
import { useAppStore } from '@melog/shared';
import { svgComponents } from '@/assets/emotions/EmotionSprite';

function EmotionInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppStore(state => state.user);

  // URL 파라미터에서 선택한 감정 정보 가져오기
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = searchParams.get('intensity');

  // 감정과 강도에 따른 아이콘 ID 매핑
  const emotionIcons: { [key: string]: string[] } = {
    기쁨: ['Yellow1', 'Yellow2', 'Yellow3', 'Yellow4', 'Yellow5'],
    설렘: ['Pink1', 'Pink2', 'Pink3', 'Pink4', 'Pink5'],
    평온: ['Green1', 'Green2', 'Green3', 'Green4', 'Green5'],
    분노: ['Red1', 'Red2', 'Red3', 'Red4', 'Red5'],
    슬픔: ['Blue1', 'Blue2', 'Blue3', 'Blue4', 'Blue5'],
    지침: ['Grey1', 'Grey2', 'Grey3', 'Grey4', 'Grey5'],
  };
  const selectedIconId =
    emotionIcons[selectedEmotion || ''][Number(selectedIntensity) - 1];

  const SvgComponent = selectedIconId ? svgComponents[selectedIconId] : null;

  console.log('2', selectedEmotion, selectedIntensity, SvgComponent);

  const handleVoiceSelect = () => {
    // 녹음 화면으로 이동
    router.push('/emotion/record');
  };

  const handleTextSelect = () => {
    // 텍스트 입력 화면으로 이동
    router.push('/emotion/write');
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
            <div className="w-[158px] h-[158px] bg-red-500 mb-6"></div>

            {/* <div className="w-[158px] h-[158px] flex items-center justify-center">
               {SvgComponent && (
                <SvgComponent
                  width={158}
                  height={158}
                  style={{
                    width: '158px',
                    height: '158px',
                    minWidth: '158px',
                    minHeight: '158px',
                  }}
                  className="!w-[158px] !h-[158px]"
                />
              )} 
            </div> */}

            <div className="text-center text-gray-500 mb-12">
              <p className="text-xl font-meetme leading-tight">
                AI가 이야기를 분석하고
                <br />
                진짜 감정을 찾아줄게요
              </p>
            </div>
          </div>

          <div className="w-full">
            {/* Selection Options */}
            <div className="w-full space-y-4 mb-4">
              {/* Voice Recording Option */}
              <button
                onClick={handleVoiceSelect}
                className="w-full bg-[#060607] text-white py-3 px-8 rounded-3xl transition-colors text-xl font-meetme"
              >
                음성으로 녹음하기
              </button>

              {/* Text Input Option */}
              <button
                onClick={handleTextSelect}
                className="w-full border border-[#060607] text-[#060607] py-3 px-8 rounded-3xl transition-colors text-xl font-meetme"
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
