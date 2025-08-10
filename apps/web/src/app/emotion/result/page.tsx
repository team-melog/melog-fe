'use client';

import { Layout, Button } from '@melog/ui';
import { useAppStore } from '@melog/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmotionResultPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [selectedOption, setSelectedOption] = useState<
    'keep' | 'change' | null
  >(null);

  // 더미 감정 분석 결과 데이터
  const emotionResults = [
    { emotion: '지침', percentage: 50, color: '#dee1e2', textColor: '#838e96' },
    { emotion: '분노', percentage: 30, color: '#ffb8b8', textColor: '#ed3a3a' },
    { emotion: '평온', percentage: 20, color: '#ccffe4', textColor: '#0cda86' },
  ];

  // 더미 데이터
  const testResult = '지침';
  const mainEmotionColor = emotionResults.find(
    el => el.emotion === testResult
  )?.textColor; // 지침 색상

  const aiSummary =
    '오늘 목소리에는 지침(50%), 분노(30%), 평온(20%)이 섞여 있었습니다. 업무량이 많아 몸과 마음이 무겁지만, 일 자체에는 여전히 흥미를 느끼고 있는 상태예요. 다만 주변 동료와의 관계나 환경에서 오는 스트레스가 피로감을 키우고 있어요.\n이런 상황에서는 잠깐의 휴식이나 가벼운 대화로 긴장을 풀어주는 것이 도움이 될 수 있습니다. 당신의 열정은 여전히 살아있으니, 에너지를 회복할 시간을 꼭 챙겨주세요.';

  const handleKeepColor = () => {
    setSelectedOption('keep');
    // 기존 색 유지 후 다음 화면으로 이동
    router.push('/emotion/final');
  };

  const handleChangeColor = () => {
    setSelectedOption('change');
    // 추천 색으로 변경 후 다음 화면으로 이동
    router.push('/emotion/final');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white flex flex-col py-10">
        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4">
          {/* Title */}
          <h1 className="text-3xl font-meetme text-center text-black mb-8 leading-tight">
            AI가 정밀하게 분석한
            <br />
            오늘 {user?.name || '사용자'}님은&nbsp;
            <span style={{ color: mainEmotionColor }}>{testResult}색</span>
            이에요
          </h1>

          {/* Emotion Visualization */}
          <div className="flex flex-col mb-8">
            {/* Main Emotion Circle */}
            <div className="relative mb-4 px-6">
              <div
                className="w-40 h-40 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: mainEmotionColor }}
              ></div>

              {/* Secondary Emotion Circles */}
              <div
                className="absolute bottom-0 right-3 w-20 h-20 rounded-lg"
                style={{ backgroundColor: '#ffb8b8' }}
              />
              <div
                className="absolute top-0 right-3 w-20 h-20 rounded-lg"
                style={{ backgroundColor: '#ccffe4' }}
              />
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="bg-white border border-[#ecedef] rounded-lg p-4 mb-8">
            <h3 className="text-2xl font-meetme text-center text-black mb-4">
              AI 감정진단서
            </h3>

            {/* Emotion Tags */}
            <div className="flex justify-center space-x-2 mb-4">
              {emotionResults.map((result, index) => (
                <div
                  key={index}
                  className="px-3 py-2 rounded-xl border"
                  style={{
                    backgroundColor: result.color,
                    borderColor:
                      index === 0
                        ? '#c0c2c4'
                        : index === 1
                          ? '#ff5a5a'
                          : '#6bfcc1',
                  }}
                >
                  <span
                    className="text-lg font-meetme"
                    style={{
                      color:
                        index === 0
                          ? '#838e96'
                          : index === 1
                            ? '#ed3a3a'
                            : '#0cda86',
                    }}
                  >
                    {result.emotion} {result.percentage}%
                  </span>
                </div>
              ))}
            </div>

            {/* AI Summary */}
            <p className="text-sm text-[#1f2024] leading-6 font-pretendard">
              {aiSummary}
            </p>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-meetme text-center text-black mb-8">
            어떤 감정으로 기록하시겠어요?
          </h2>

          {/* Color Selection Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleKeepColor}
              className={`w-full py-4 rounded-xl font-meetme text-xl transition-colors border-2 bg-white ${
                selectedOption === 'keep'
                  ? 'bg-gray-500 text-white border-gray-500'
                  : 'bg-white hover:bg-gray-50 text-black border-[#36393f]'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-500"></div>
                <span>처음에 선택한 색상</span>
              </div>
            </Button>

            <Button
              onClick={handleChangeColor}
              className={`w-full py-4 rounded-xl font-meetme text-xl transition-colors border-2 ${
                selectedOption === 'change'
                  ? 'bg-gray-500 text-white border-gray-500'
                  : 'bg-white hover:bg-gray-50 text-black border-[#36393f]'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-400"></div>
                <span>AI 감정진단 색</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
