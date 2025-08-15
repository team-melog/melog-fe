'use client';

import { Layout, Button, LeftIcon } from '@melog/ui';
import { useAppStore } from '@/features/store';
import { useRouter } from 'next/navigation';
import { svgComponents } from '@/assets/svgs/EmotionSvg';
import React from 'react';
import { emotionIconsByStep } from '@/entities/emotion/types';

export default function EmotionFinalPage() {
  const router = useRouter();
  const { user } = useAppStore();

  // 현재 날짜 정보
  const today = new Date();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDay = daysOfWeek[today.getDay()];
  const formattedDate = `${today.getFullYear()}.${String(
    today.getMonth() + 1
  ).padStart(2, '0')}.${String(today.getDate()).padStart(
    2,
    '0'
  )}. ${currentDay}요일`;

  // AI 감정 분석 결과 데이터
  const emotionResults = [
    {
      emotion: '지침',
      percentage: 50,
      color: '#dee1e2',
      borderColor: '#c0c2c4',
      textColor: '#838e96',
    },
    {
      emotion: '분노',
      percentage: 30,
      color: '#ffb8b8',
      borderColor: '#ff5a5a',
      textColor: '#ed3a3a',
    },
    {
      emotion: '평온',
      percentage: 20,
      color: '#ccffe4',
      borderColor: '#6bfcc1',
      textColor: '#0cda86',
    },
  ].sort((a, b) => b.percentage - a.percentage);

  const aiSummary = `오늘 ${user?.name || '사용자'}님의 목소리에는 지침(50%), 분노(30%), 평온(20%)이 섞여 있었습니다. 업무량이 많아 몸과 마음이 무겁지만, 일 자체에는 여전히 흥미를 느끼고 있는 상태예요. 다만 주변 동료와의 관계나 환경에서 오는 스트레스가 피로감을 키우고 있어요.\n\n이런 상황에서는 잠깐의 휴식이나 가벼운 대화로 긴장을 풀어주는 것이 도움이 될 수 있습니다. 당신의 열정은 여전히 살아있으니, 에너지를 회복할 시간을 꼭 챙겨주세요.`;

  // percentage를 5단계로 나누어 단계 계산 (0-20: 1단계, 21-40: 2단계, 41-60: 3단계, 61-80: 4단계, 81-100: 5단계)
  const getEmotionStep = (percentage: number) => {
    if (percentage <= 20) return 1;
    if (percentage <= 40) return 2;
    if (percentage <= 60) return 3;
    if (percentage <= 80) return 4;
    return 5;
  };

  // 각 감정에 대해 해당하는 단계의 아이콘 키를 계산하는 함수
  const getEmotionIconKey = (emotion: string, percentage: number) => {
    const step = getEmotionStep(percentage);
    return emotionIconsByStep[emotion as keyof typeof emotionIconsByStep]?.[
      step - 1
    ];
  };

  const mainEmotionIconKey = getEmotionIconKey(
    emotionResults[0].emotion,
    emotionResults[0].percentage
  );

  const handleConfirm = () => {
    // 피드 화면으로 이동
    router.push('/feed');
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={false}>
      <div className="font-meetme min-h-screen bg-white flex flex-col">
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
        <div className="flex-1 flex flex-col items-center mb-4">
          {/* Result Card */}
          <div className="w-full max-w-sm bg-white border border-[#d0d2d7] rounded-lg p-6">
            {/* Date */}
            <div className="mb-6">
              <p className="text-2xl font-normal text-black tracking-[-0.22px] leading-[26.4px]">
                {formattedDate}
              </p>
            </div>

            {/* Emotion Circle */}
            <div className="flex justify-center mb-8">
              <div className="w-[220px] h-[220px]">
                {mainEmotionIconKey &&
                  svgComponents[mainEmotionIconKey] &&
                  React.createElement(svgComponents[mainEmotionIconKey], {
                    width: 220,
                    height: 220,
                  })}
              </div>
            </div>

            {/* AI Emotion Diagnosis Card */}
            <div className="mb-6">
              <h3 className="text-2xl font-normal text-[#060607] mb-4 tracking-[-0.26px] leading-[31.2px]">
                지침색 (AI 감정진단)
              </h3>

              {/* Emotion Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {emotionResults.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-xl border"
                    style={{
                      backgroundColor: result.color,
                      borderColor: result.borderColor,
                    }}
                  >
                    <span
                      className="text-lg font-normal tracking-[-0.18px] leading-[21.6px]"
                      style={{ color: result.textColor }}
                    >
                      {result.emotion} {result.percentage}%
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              <div className="bg-white rounded-lg">
                <p className="text-[15px] font-medium text-[#1f2024] leading-6 tracking-[-0.15px] whitespace-pre-line">
                  {aiSummary}
                </p>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleConfirm}
                className="w-full bg-[#060607] hover:bg-[#2a2a2a] text-white font-normal text-xl py-3 rounded-[30px] tracking-[-0.2px] transition-colors"
              >
                피드로 이동
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
