'use client';

import React from 'react';
import { Layout, Button } from '@melog/ui';
import { useAppStore, useEmotionStore } from '@/features/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { svgComponents } from '@/assets/svgs/emotions/EmotionSvg';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { emotionIconsByStep, emotionColorsByStep } from '@/entities';
import GradientIcon from '@/assets/svgs/common/GradientIcon';
import RefreshIcon from '@/assets/svgs/common/RefreshIcon';
import { useDeleteEmotionDetail, useUpdateEmotion } from '@/features';

const testData = {
  id: 5,
  text: '야근하고 일이 너무 많은 하루 였다. 힘들다',
  summary: '야근과 많은 일로 인해 힘든 하루를 보냈습니다.',
  comment: '',
  date: '2025-08-15',
  createdAt: '2025-08-15T02:40:39.398010137',
  user: {
    id: null,
    nickname: '안녕',
    createdAt: '2025-08-15T02:40:10.187918',
  },
  emotions: [
    {
      id: 4,
      percentage: 60,
      step: 4,
      type: '지침',
    },
    {
      id: 5,
      percentage: 30,
      step: 2,
      type: '슬픔',
    },
    {
      id: 6,
      percentage: 10,
      step: 1,
      type: '분노',
    },
  ],
  userSelectedEmotion: {
    id: 5,
    percentage: 100,
    step: 2,
    type: '설렘',
  },
  emotionKeywords: [
    {
      id: 6,
      keyword: '야근',
      weight: 5,
    },
    {
      id: 7,
      keyword: '힘들다',
      weight: 4,
    },
    {
      id: 8,
      keyword: '일',
      weight: 3,
    },
    {
      id: 9,
      keyword: '하루',
      weight: 2,
    },
    {
      id: 10,
      keyword: '지침',
      weight: 1,
    },
  ],
};

function EmotionResultContent() {
  const router = useRouter();
  const { user } = useAppStore();
  const { analysisResult } = useEmotionStore();
  const [selectedOption, setSelectedOption] = useState<
    'keep' | 'change' | null
  >(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'record'>('ai');
  const { mutate: updateEmotion } = useUpdateEmotion();
  const searchParams = useSearchParams();
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = Number(searchParams.get('intensity'));
  const selectedColor = searchParams.get('color');

  const { mutate: deleteEmotion } = useDeleteEmotionDetail();

  // API 응답 결과가 있으면 사용하고, 없으면 기본 테스트 데이터 사용
  const currentData =
    analysisResult && typeof analysisResult === 'object'
      ? (analysisResult as typeof testData)
      : testData;

  // 더미 데이터
  const mainEmotion = currentData.emotions[0];
  const mainColor =
    emotionColorsByStep[mainEmotion?.type as keyof typeof emotionColorsByStep];
  const mainEmotionColor = (mainColor && mainColor[4]) || '#060607';

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
    mainEmotion?.type,
    mainEmotion?.percentage
  );

  const onUpdateSelectedEmotion = async () => {
    setSelectedOption('keep');
    if (currentData) {
      updateEmotion({
        nickname: user.name,
        id: String(currentData.id),
        request: {
          emotions: [
            {
              type: currentData.userSelectedEmotion.type,
              percentage: currentData.userSelectedEmotion.percentage,
            },
          ],
        },
      });
    }
    router.push(`/feed/${currentData.id}`);
  };

  const onUpdateAIEmotion = () => {
    setSelectedOption('change');
    if (currentData) {
      updateEmotion({
        nickname: user.name,
        id: String(currentData.id),
        request: {
          emotions: currentData.emotions.map(emotion => ({
            type: emotion.type,
            percentage: emotion.percentage,
          })),
        },
      });
    }
    router.push(`/feed/${currentData.id}`);
  };
  const handleRetry = () => {
    if (selectedEmotion) {
      const params = new URLSearchParams({
        emotion: selectedEmotion,
        intensity: selectedIntensity.toString(),
        color: selectedColor || '',
      });
      deleteEmotion({ nickname: user.name, id: currentData.id.toString() });
      router.push(`/emotion/input?${params.toString()}`);
    } else {
      router.push(`/emotion/skip`);
    }
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white flex flex-col py-10">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <h1 className="text-3xl font-meetme text-center text-black mb-8 leading-tight">
            AI가 정밀하게 분석한
            <br />
            오늘 {user?.name || '사용자'}님은&nbsp;
            <span style={{ color: mainEmotionColor }}>{mainEmotion?.type}</span>
            이에요
          </h1>

          {/* Emotion Visualization */}
          <div className="flex flex-col items-center justify-center mb-8">
            {/* Main Emotion Circle */}
            <div
              className={`relative mb-4 flex w-full justify-center ${
                currentData.emotions.length > 2 ? 'px-auto gap-2' : 'px-0'
              }  ${
                currentData.emotions.length === 1
                  ? 'flex justify-center'
                  : 'w-full'
              }`}
            >
              <div className="rounded-lg flex items-center ">
                {mainEmotionIconKey && svgComponents[mainEmotionIconKey] ? (
                  React.createElement(svgComponents[mainEmotionIconKey], {
                    width: currentData.emotions.length === 3 ? 160 : 150,
                    height: currentData.emotions.length === 3 ? 160 : 150,
                  })
                ) : (
                  <span className="text-lg text-gray-500">
                    {mainEmotion?.type}
                  </span>
                )}
              </div>

              {/* Secondary Emotion Circles */}
              <div
                className={`flex ${
                  currentData.emotions.length === 3 ? 'flex-col' : ''
                }`}
              >
                {currentData.emotions[1] && (
                  <div className="rounded-lg flex items-center justify-center">
                    {(() => {
                      const secondEmotion = currentData.emotions[1]; // 분노 30%
                      const secondEmotionIconKey = getEmotionIconKey(
                        secondEmotion.type,
                        secondEmotion.percentage
                      );
                      return secondEmotionIconKey &&
                        svgComponents[secondEmotionIconKey] ? (
                        React.createElement(
                          svgComponents[secondEmotionIconKey],
                          {
                            width: currentData.emotions.length === 3 ? 80 : 150,
                            height:
                              currentData.emotions.length === 3 ? 80 : 150,
                          }
                        )
                      ) : (
                        <span className="text-sm text-gray-500">
                          {secondEmotion.type}
                        </span>
                      );
                    })()}
                  </div>
                )}
                {currentData.emotions[2] && (
                  <div className="rounded-lg flex items-center justify-center">
                    {(() => {
                      const thirdEmotion = currentData.emotions[2]; // 평온 20%
                      const thirdEmotionIconKey = getEmotionIconKey(
                        thirdEmotion.type,
                        thirdEmotion.percentage
                      );
                      return thirdEmotionIconKey &&
                        svgComponents[thirdEmotionIconKey] ? (
                        React.createElement(
                          svgComponents[thirdEmotionIconKey],
                          {
                            width: 80,
                            height: 80,
                          }
                        )
                      ) : (
                        <span className="text-sm text-gray-500">
                          {thirdEmotion.type}
                        </span>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg font-meetme text-lg transition-colors ${
                activeTab === 'ai'
                  ? 'bg-[#060607] text-white'
                  : 'bg-white text-[#060607] border border-[#ecedef]'
              }`}
            >
              <GradientIcon width={14} height={14} />
              AI 감정진단
            </button>
            <button
              onClick={() => setActiveTab('record')}
              className={`flex-1 py-3 px-4 rounded-lg font-meetme text-lg transition-colors ${
                activeTab === 'record'
                  ? 'bg-[#060607] text-white'
                  : 'bg-white text-[#060607] border border-[#ecedef]'
              }`}
            >
              나의 기록
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="rounded-lg p-4 mb-8 bg-greyBgColor">
            {/* Tab Content */}
            {activeTab === 'ai' ? (
              <div>
                {/* Emotion Tags */}
                <div className="flex justify-center space-x-2 mb-4">
                  {currentData.emotions.map((result, index) => {
                    const colors =
                      emotionColorsByStep[
                        result.type as keyof typeof emotionColorsByStep
                      ];
                    const backgroundColor = colors ? colors[0] : '#cccccc';
                    const borderColor = colors ? colors[2] : '#cccccc';
                    const textColor = colors ? colors[4] : '#1f2024';

                    return (
                      <div
                        key={index}
                        className="w-[78px] h-[40px] rounded-xl border flex items-center justify-center"
                        style={{
                          backgroundColor: backgroundColor,
                          borderColor: borderColor,
                        }}
                      >
                        <span
                          className="text-lg font-meetme"
                          style={{
                            color: textColor,
                          }}
                        >
                          {result.type} {result.percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* AI Summary */}
                <p className="text-sm text-[#1f2024] leading-6 font-pretendard">
                  {`${currentData.summary}\n`}
                  <br />
                  {currentData.comment ? currentData.comment : ''}
                </p>
              </div>
            ) : (
              <div>
                {/* User's Text Record */}
                <p className="text-sm text-[#1f2024] leading-6 font-pretendard">
                  {currentData.text}
                </p>
              </div>
            )}
          </div>

          <div>
            {activeTab === 'ai' && (
              <div className="text-center text-sm font-pretendard text-[#B5B8C0] mb-20">
                미로그가 알려준 오늘의 감정,
                <br />그 의미를 정하는 건 나예요
              </div>
            )}

            {/* Question */}
            <h2 className="text-2xl font-meetme text-center text-black mb-8">
              감정 선택하기
            </h2>

            {/* Color Selection Buttons */}
            <div className="space-y-4 w-full flex flex-col items-center">
              {currentData.userSelectedEmotion ? (
                <Button
                  onClick={onUpdateSelectedEmotion}
                  className={`w-4/6 py-4 rounded-xl font-meetme text-xl border-2 bg-white ${
                    selectedOption === 'keep'
                      ? ' text-white border-gray-500'
                      : 'bg-white text-black border-[#36393f]'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 rounded-full">
                      {/* {SelectedSvgComponent && (
                    <SelectedSvgComponent width={40} height={40} />
                  )} */}

                      {(() => {
                        const selectedEmotionIconKey = getEmotionIconKey(
                          selectedEmotion || '',
                          selectedIntensity * 20
                        );
                        return (
                          selectedEmotionIconKey &&
                          svgComponents[selectedEmotionIconKey] &&
                          React.createElement(
                            svgComponents[selectedEmotionIconKey],
                            {
                              width: 40,
                              height: 40,
                            }
                          )
                        );
                      })()}
                    </div>
                    <span>처음 선택한 감정</span>
                  </div>
                </Button>
              ) : null}

              <Button
                onClick={onUpdateAIEmotion}
                className={`w-4/6 py-4 rounded-xl font-meetme text-xl border-2 : ${
                  selectedOption === 'change'
                    ? 'text-white border-gray-500'
                    : 'bg-white text-black border-[#36393f]'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-10 h-10 rounded-full">
                    {mainEmotionIconKey && svgComponents[mainEmotionIconKey] ? (
                      React.createElement(svgComponents[mainEmotionIconKey], {
                        width: 40,
                        height: 40,
                      })
                    ) : (
                      <span className="text-lg text-gray-500">
                        {mainEmotion?.type}
                      </span>
                    )}
                  </div>
                  <span>AI 감정진단 감정</span>
                </div>
              </Button>
              <Button
                onClick={handleRetry}
                className={`w-4/6 py-4 rounded-xl font-meetme text-xl`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <RefreshIcon width={20} height={20} />
                  <span>다시 기록하기</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function EmotionResultPage() {
  return (
    <SuspenseWrapper>
      <EmotionResultContent />
    </SuspenseWrapper>
  );
}
