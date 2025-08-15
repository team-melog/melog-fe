'use client';

import { useMemo } from 'react';
import { Button, Layout } from '@melog/ui';
import { useAppStore } from '@/features/store';
import ProfileIcon from '@/assets/icons/ProfileIcon.svg';
import Link from 'next/link';
import { emotionIconsByStep } from '@/entities/emotion/types';
import { svgComponents } from '@/assets/svgs/EmotionSvg';
import { useEmotionChart, useEmotionInsight } from '@/features/emotion';

const testData = {
  thisMonth: {
    기쁨: 50,
    지침: 30,
    설렘: 10,
  },
  compareWithLastMonth: {
    기쁨: -5,
    설렘: 10,
  },
  topKeywords: [
    { keyword: '기쁨', weight: 40 },
    { keyword: '지침', weight: 22 },
    { keyword: '설렘', weight: 18 },
  ],
  monthlySummary:
    '지침과 피곤이 반복되는 한 달이었습니다. 감정 기복이 큰 경향이 보입니다.',
};

export default function ProfilePage() {
  const { user } = useAppStore();

  // 현재 날짜를 기반으로 YYYY-MM 형식 생성
  const currentMonth =
    new Date().getFullYear() +
    '-' +
    String(new Date().getMonth() + 1).padStart(2, '0');

  const { data: emotionChart } = useEmotionChart(
    user?.name || '',
    currentMonth
  );
  const { data: emotionInsight } = useEmotionInsight(
    user?.name || '',
    currentMonth
  );
  console.log('Chart', emotionChart);
  console.log('Insight', emotionInsight);

  // 감정 기록이 있는지 확인 (testData 사용)
  const hasEmotionData = true; // testData가 있으므로 항상 true

  // 사용자 가입일부터 현재까지의 일수 계산
  const daysSinceJoin = useMemo(() => {
    // 임시로 2025년 1월 1일부터 계산 (실제로는 사용자 가입일을 사용)
    const joinDate = new Date('2025-08-07');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  // 현재 월의 감정 데이터 분석 (testData 사용)
  const monthlyStats = useMemo(() => {
    if (!hasEmotionData) return null;

    // thisMonth 데이터를 기반으로 감정 분포도 생성
    const totalWeight = Object.values(testData.thisMonth).reduce(
      (sum, weight) => sum + weight,
      0
    );
    const emotionPercentages = Object.entries(testData.thisMonth).map(
      ([emotion, weight]) => {
        // 가중치를 20으로 나누어 5단계 step 계산 (1-5)
        const step = Math.ceil(weight / 20);

        return {
          emotion,
          percentage: Math.round((weight / totalWeight) * 100),
          step: step,
          color:
            emotion === '기쁨'
              ? '#FFD700'
              : emotion === '지침'
                ? '#DEE1E2'
                : emotion === '불안'
                  ? '#8A2BE2'
                  : '#8A2BE2',
        };
      }
    );

    return {
      totalEntries: Object.keys(testData.thisMonth).length,
      emotionPercentages: emotionPercentages,
    };
  }, [hasEmotionData]);

  // 감정 키워드 분석 (testData 사용)
  const emotionKeywords = useMemo(() => {
    if (!hasEmotionData) return [];

    return testData.topKeywords.map(item => ({
      keyword: item.keyword,
      weight: item.weight,
    }));
  }, [hasEmotionData]);

  return (
    <Layout showTabBar={true} nickname={user?.name}>
      <div className="font-meetme min-h-svh bg-white pb-20">
        {/* 프로필 섹션 */}
        <div className="px-4 pt-6 mb-6 border-b border-[#d0d2d7]">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-white rounded-full mr-4 border border-[#ecedef] flex items-center justify-center">
              <ProfileIcon />
            </div>
            <div>
              <h1 className="text-[26px] font-normal text-black tracking-[-0.26px] leading-[31.2px]">
                {user?.name || '닉네임명'}
              </h1>
            </div>
          </div>

          {/* 함께한 지 X일 째 */}
          <div className="bg-white border border-[#d0d2d7] rounded-xl p-4 mb-14">
            <p className="text-[18px] font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px]">
              함께한 지 {daysSinceJoin}일 째
            </p>
          </div>
        </div>

        {/* 이 달의 요약 섹션 */}
        <div className="px-4 pb-6">
          {!hasEmotionData || !monthlyStats ? (
            /* 감정 기록이 없는 버전 - "마이_기록 전" */
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-md text-black mb-5">
                아직 기록된 감정이 없어요
              </p>
              <Link href="/emotion/select" prefetch={true}>
                <Button className="bg-[#060607] hover:bg-[#2a2a2a] text-white font-normal text-xl py-3 px-16 rounded-[30px] tracking-[-0.2px] transition-colors">
                  감정 기록하러 가기
                </Button>
              </Link>
            </div>
          ) : (
            /* 감정 기록이 있는 버전 - "마이_기록있음" */
            <div className="space-y-6">
              <h2 className="text-[20px] font-normal text-[#36393f] tracking-[-0.2px] leading-6 mb-6">
                이달의 요약
              </h2>
              {/* 감정 분포도 */}
              <div className="bg-white border border-[#d0d2d7] rounded-[20px] p-4">
                <h3 className="text-[18px] font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px] mb-4">
                  감정 분포도
                </h3>

                {/* 바 차트 */}
                <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div className="flex h-full">
                    {monthlyStats.emotionPercentages.map(emotion => (
                      <div
                        key={emotion.emotion}
                        className="h-full"
                        style={{
                          width: `${emotion.percentage}%`,
                          backgroundColor: emotion.color,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 감정별 상세 정보 */}
                <div className="space-y-3">
                  {monthlyStats.emotionPercentages.map(emotion => (
                    <div
                      key={emotion.emotion}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {(() => {
                            // emotionIconsByStep에서 해당 감정과 단계에 맞는 SVG 컴포넌트 찾기
                            const iconId =
                              emotionIconsByStep[
                                emotion.emotion as keyof typeof emotionIconsByStep
                              ]?.[emotion.step - 1]; // 계산된 step 사용
                            const SvgComponent = iconId
                              ? svgComponents[iconId]
                              : null;

                            if (!SvgComponent) return null;

                            return <SvgComponent width={24} height={24} />;
                          })()}
                        </div>
                        <span className="text-[17px] font-normal text-[#36393f] tracking-[-0.17px] leading-[20.4px]">
                          {emotion.emotion}
                        </span>
                      </div>
                      <span className="text-[17px] font-normal text-[#36393f] tracking-[-0.17px] leading-[20.4px]">
                        {emotion.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 주요 감정 키워드 */}
              <div className="bg-white border border-[#d0d2d7] rounded-[20px] p-4">
                <h3 className="text-[18px] font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px] mb-4">
                  주요 감정 키워드
                </h3>
                <div className="flex justify-between">
                  {emotionKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-[17px] font-normal text-[#36393f] tracking-[-0.17px] leading-[20.4px]">
                        {keyword.keyword}
                      </span>
                      <span className="px-2 py-1 bg-[#dee1e2] border border-[#c0c2c4] rounded-lg text-[18px] font-normal text-[#838e96] tracking-[-0.18px] leading-[21.6px]">
                        {keyword.weight}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
