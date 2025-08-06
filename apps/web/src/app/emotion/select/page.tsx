'use client';

import { Layout, Button, LeftIcon, CheckIcon } from '@melog/ui';
import { useAppStore } from '@melog/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { emotions, intensityLabels } from '@melog/shared';
import React from 'react';

interface EmotionSelection {
  emotion: string;
  intensity: number;
  color: string;
}

export default function EmotionSelectPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [selectedEmotion, setSelectedEmotion] =
    useState<EmotionSelection | null>(null);

  const handleEmotionSelect = (
    emotionName: string,
    intensity: number,
    color: string
  ) => {
    setSelectedEmotion({
      emotion: emotionName,
      intensity: intensity + 1, // 1-5 강도로 변환
      color: color,
    });
  };

  const handleSkip = () => {
    // 건너뛰기 시 건너뛰기 전용 화면으로 이동
    router.push('/emotion/skip');
  };

  const handleNext = () => {
    if (selectedEmotion) {
      // 선택된 감정 정보를 URL 파라미터로 전달
      const params = new URLSearchParams({
        emotion: selectedEmotion.emotion,
        intensity: selectedEmotion.intensity.toString(),
        color: selectedEmotion.color,
      });
      router.push(`/emotion/input?${params.toString()}`);
    }
  };

  return (
    <Layout showTabBar={false}>
      <div className="font-meetme bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center py-3">
          <button
            onClick={() => router.back()}
            className="w-6 h-6 flex items-center justify-center"
          >
            <LeftIcon />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Title Section */}
          <div className="text-center mb-2">
            <p className="text-2xl text-[#656a76] mb-2">
              {user?.name || '사용자'}님의 감정
            </p>
            <div className="text-4xl flex items-end justify-center h-[42px]">
              <span className="text-[#060607]">오늘은&nbsp;</span>

              {selectedEmotion ? (
                <span className="border-b-[2px] border-[#060607]">
                  {selectedEmotion?.intensity &&
                    intensityLabels[selectedEmotion?.intensity - 1]}
                  &nbsp;
                  {selectedEmotion?.emotion}
                </span>
              ) : (
                <div className="w-20 h-[2px] bg-[#060607] ml-2"></div>
              )}
            </div>
          </div>

          {/* Emotion Grid */}
          <div className="mt-2">
            {/* Grid Container */}
            <div
              className="grid gap-0 text-lg text-[#2a2a2a]"
              style={{ gridTemplateColumns: '30px repeat(5, 1fr)' }}
            >
              {/* Header Row */}
              <div></div> {/* Empty cell for alignment */}
              <div className="text-center flex items-center justify-center">
                조금
              </div>
              <div className="text-center flex items-center justify-center">
                조금많이
              </div>
              <div className="text-center flex items-center justify-center">
                적당히
              </div>
              <div className="text-center flex items-center justify-center">
                많이
              </div>
              <div className="text-center flex items-center justify-center">
                매우
              </div>
            </div>
            <div
              className="grid gap-0 h-[calc(95svh-300px)] text-lg text-[#2a2a2a]"
              style={{ gridTemplateColumns: '30px repeat(5, 1fr)' }}
            >
              {/* Emotion Rows */}
              {emotions.map((emotion, rowIndex) => (
                <React.Fragment key={emotion.name}>
                  {/* Emotion Name */}
                  <div className="flex items-center justify-center">
                    <span className="text-lg text-[#2a2a2a] text-center">
                      {emotion.name}
                    </span>
                  </div>

                  {/* Color Cells */}
                  {emotion.colors.map((color, colIndex) => (
                    <div
                      key={colIndex}
                      className={`relative flex items-center justify-center border-r border-b border-[#eae9e9] ${
                        colIndex === 4 ? 'border-r-0' : ''
                      } ${
                        rowIndex === emotions.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <button
                        onClick={() =>
                          handleEmotionSelect(emotion.name, colIndex, color)
                        }
                        className={`w-3/4 h-3/4 min-w-[40px] min-h-[40px] transition-all ${
                          selectedEmotion?.emotion === emotion.name &&
                          selectedEmotion?.intensity === colIndex + 1
                            ? ''
                            : 'hover:bg-gray-50'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {selectedEmotion?.emotion === emotion.name &&
                          selectedEmotion?.intensity === colIndex + 1 && (
                            <CheckIcon className="absolute right-1 bottom-1" />
                          )}
                      </button>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="py-6 space-y-5 flex flex-col items-center">
            <Button
              onClick={handleSkip}
              className="bg-transparent text-[#36393f] font-meetme text-xl p-0 px-0 transition-colors underline w-fit rounded-none hover:bg-transparent "
            >
              감정을 잘 모르겠어요
            </Button>

            <Button
              onClick={handleNext}
              className="w-full bg-[#b5b8c0] hover:bg-[#a0a4ad] text-white font-meetme text-xl py-3 px-6 rounded-3xl transition-colors"
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
