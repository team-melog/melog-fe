'use client';

import { useMemo } from 'react';
import { Button, Layout } from '@melog/ui';
import { useAppStore } from '@/features/store';
import ProfileIcon from '@/assets/icons/ProfileIcon.svg';
import Link from 'next/link';
import {
  emotionIconsByStep,
  emotionColorsByStep,
} from '@/entities/emotion/types';
import { svgComponents } from '@/assets/svgs/emotions/EmotionSvg';
import { useEmotionChart, useEmotionInsight } from '@/features/emotion';
import HighlightsIcon from '@/assets/svgs/common/HighlightsIcon';

export default function ProfilePage() {
  const { user } = useAppStore();

  // 현재 날짜를 기반으로 YYYY-MM 형식 생성
  const currentMonth =
    new Date().getFullYear() +
    '-' +
    String(new Date().getMonth() + 1).padStart(2, '0');

  const { data: emotionChart } = useEmotionChart(user?.name, currentMonth);
  const { data: emotionInsight } = useEmotionInsight(user?.name, currentMonth);

  // 사용자 가입일부터 현재까지의 일수 계산
  const daysSinceJoin = useMemo(() => {
    const joinDate = new Date(user?.createdAt || '');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  // 감정 기록이 있는지 확인 (emotionChart의 모든 값의 합이 0보다 큰지)
  const hasEmotionData = useMemo(() => {
    if (!emotionChart) return false;

    const chartData = emotionChart as unknown as {
      thisMonth: Record<string, number>;
    };
    if (!chartData?.thisMonth) return false;

    const totalWeight = Object.values(chartData.thisMonth).reduce(
      (sum: number, weight: number) => sum + weight,
      0
    );

    return totalWeight > 0;
  }, [emotionChart]);

  // 현재 월의 감정 데이터 분석
  const monthlyStats = useMemo(() => {
    if (!hasEmotionData || !emotionChart) return null;

    // 타입 단언을 사용하여 실제 데이터 구조에 맞춤
    const chartData = emotionChart as unknown as {
      thisMonth: Record<string, number>;
    };
    if (!chartData.thisMonth) return null;

    const totalWeight = Object.values(chartData.thisMonth).reduce(
      (sum: number, weight: number) => sum + weight,
      0
    );
    const emotionPercentages = Object.entries(chartData.thisMonth)
      .filter(([, weight]) => weight > 0) // 0보다 큰 값만 필터링
      .map(([emotion, weight]) => {
        // 가중치를 20으로 나누어 5단계 step 계산 (1-5)
        const step = Math.ceil(weight / 20);

        return {
          emotion,
          percentage: Math.round((weight / totalWeight) * 100),
          step: step,
          color:
            emotionColorsByStep[emotion as keyof typeof emotionColorsByStep]?.[
              step - 1
            ] || '#DEE1E2',
        };
      })
      .sort((a, b) => b.percentage - a.percentage); // percentage 높은 순서대로 정렬

    return {
      totalEntries: Object.keys(chartData.thisMonth).length,
      emotionPercentages: emotionPercentages,
    };
  }, [hasEmotionData, emotionChart]);

  // 감정 키워드 분석
  const emotionKeywords = useMemo(() => {
    const insight = emotionInsight as unknown as {
      topKeywords: Array<{ keyword: string; weight: number }>;
    };
    if (!insight?.topKeywords) return [];

    return insight.topKeywords.map(
      (item: { keyword: string; weight: number }) => ({
        keyword: item.keyword,
        weight: item.weight,
      })
    );
  }, [emotionInsight]);

  return (
    <Layout showTabBar={true} nickname={user?.name}>
      <div className="font-meetme bg-white h-[calc(100vh-59px)]">
        <div className="grid h-[calc(100vh-59px)]">
          {/* 프로필 섹션 - 위쪽 */}
          <div className="row-span-1 px-4 pt-6 border-b border-[#ECEDEF]">
            <div className="flex items-center">
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
            <div className="bg-greyBgColor rounded-xl p-4 my-4">
              <p className="text-[18px] font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px]">
                함께한 지 {daysSinceJoin}일 째
              </p>
            </div>
          </div>

          {/* 이 달의 요약 섹션 - 아래쪽 */}
          <div className="row-span-3 bg-greyBgColor">
            {!hasEmotionData || !monthlyStats ? (
              /* 감정 기록이 없는 버전 - "마이_기록 전" */
              <div className="flex flex-col items-center justify-center px-4 py-6">
                <p className="text-md text-black mb-5">
                  아직 기록된 감정이 없어요
                </p>
                <Link href="/emotion/select" prefetch={true}>
                  <Button className="bg-[#060607] text-white font-normal text-xl py-3 px-16 rounded-[30px] tracking-[-0.2px] transition-colors">
                    감정 기록하러 가기
                  </Button>
                </Link>
              </div>
            ) : (
              /* 감정 기록이 있는 버전 - "마이_기록있음" */
              <div className="space-y-6 px-4 py-6">
                <div className="relative flex items-center gap-1">
                  <h2 className="z-10 font-meetme text-[18px] font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px]">
                    이달의 요약
                  </h2>
                  <div className="absolute top-[4px] left-0 z-0">
                    <HighlightsIcon width={60} height={15} />
                  </div>
                </div>
                {/* 감정 분포도 */}
                <div className="bg-white rounded-[20px] p-4">
                  <h3 className="text-[18px] font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px] mb-4">
                    감정 분포도
                  </h3>

                  {/* 바 차트 */}
                  <div className="w-full h-5 bg-gray-200 overflow-hidden mb-4">
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
                <div className="bg-white rounded-[20px] p-4">
                  <h3 className="text-[18px] font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px] mb-4">
                    주요 감정 키워드
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {emotionKeywords.map(
                      (
                        keyword: { keyword: string; weight: number },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-[17px] font-normal text-[#36393f] tracking-[-0.17px] leading-[20.4px]">
                            {keyword.keyword}
                          </span>
                          <span className="px-2 py-1 bg-[#dee1e2] border border-[#c0c2c4] rounded-lg text-[18px] font-normal text-[#838e96] tracking-[-0.18px] leading-[21.6px]">
                            {keyword.weight}%
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
