'use client';

import { useState, useMemo } from 'react';
import { Layout } from '@melog/ui';
import { useAppStore } from '@/features/store';
import {
  useEmotionInsight,
  useEmotionMonthly,
} from '@/features/emotion/hooks/useEmotionApi';
import { svgComponents } from '@/assets/svgs/emotions/EmotionSvg';
import { EmotionInsightResponse } from '@/features/emotion/api/types';
import { emotionIconsByStep } from '@/entities/emotion/types';
import Link from 'next/link';
import HighlightsIcon from '@/assets/svgs/common/HighlightsIcon';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useAppStore();

  // 날짜를 YYYY-MM-DD 형식으로 변환 (시간 제외)
  const formatDateOnly = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentMonthFromDate =
    currentDate.getFullYear() +
    '-' +
    String(currentDate.getMonth() + 1).padStart(2, '0');

  const { data: emotionMonthly } = useEmotionMonthly(
    user.name,
    formatDateOnly(currentDate).slice(0, 7)
  );
  const { data: emotionInsight } = useEmotionInsight(
    user.name,
    currentMonthFromDate
  );

  type EmotionMonthlyType = Array<{
    id: number | null;
    date: string;
    emotions: Array<{
      id: number;
      percentage: number;
      step: number;
      type: string;
    }>;
  }>;

  // 데이터 매핑
  const testEmotionDataByDate = useMemo(() => {
    const data: {
      [key: string]: {
        emotionId: number | null;
        id: number;
        type: string;
        step: number;
        svgComponent: React.ComponentType<{ width?: number; height?: number }>;
      };
    } = {};

    // emotionMonthly가 존재하고 배열일 때만 처리
    if (emotionMonthly && Array.isArray(emotionMonthly)) {
      (emotionMonthly as unknown as EmotionMonthlyType).forEach(dayData => {
        // emotions 배열이 비어있지 않을 때만 처리
        if (dayData.emotions && dayData.emotions.length > 0) {
          // 가장 높은 percentage를 가진 감정을 메인 감정으로 선택
          const mainEmotion = dayData.emotions.reduce((prev, current) =>
            prev.percentage > current.percentage ? prev : current
          );

          const iconKey =
            emotionIconsByStep[
              mainEmotion.type as keyof typeof emotionIconsByStep
            ]?.[mainEmotion.step - 1];
          const svgComponent = iconKey ? svgComponents[iconKey] : null;

          if (svgComponent) {
            data[dayData.date] = {
              emotionId: (dayData.id as unknown as number) || null,
              id: mainEmotion.id || 0,
              type: mainEmotion.type,
              step: mainEmotion.step,
              svgComponent: svgComponent,
            };
          }
        }
      });
    }

    return data;
  }, [emotionMonthly]);

  // 현재 월의 첫 번째 날과 마지막 날 계산
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // 월의 첫 번째 날의 요일 (0: 일요일, 1: 월요일, ...)
  const firstDayWeekday = firstDayOfMonth.getDay();

  // 현재 월의 감정 데이터 매핑
  const emotionDataByDate = useMemo(() => {
    const data: {
      [key: string]: {
        emotionId: number;
        id: number;
        type: string;
        svgComponent?: React.ComponentType<{ width?: number; height?: number }>;
      };
    } = {};

    Object.keys(testEmotionDataByDate).forEach(dateKey => {
      const item = testEmotionDataByDate[dateKey];
      data[dateKey] = {
        emotionId: item.emotionId || 0,
        id: item.id,
        type: item.type,
        svgComponent: item.svgComponent,
      };
    });

    return data;
  }, [testEmotionDataByDate]);

  // 현재 월에 데이터가 있는지 확인
  const hasDataInCurrentMonth = useMemo(() => {
    return Object.keys(emotionDataByDate).length > 0;
  }, [emotionDataByDate]);

  // 캘린더에 표시할 날짜들 생성
  const calendarDays = [];

  // 이전 달의 마지막 날짜들 (첫 번째 주의 빈 칸 채우기)
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const prevDate = new Date(firstDayOfMonth);
    prevDate.setDate(prevDate.getDate() - (i + 1));
    calendarDays.push({ date: prevDate, isCurrentMonth: false });
  }

  // 현재 달의 날짜들
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    calendarDays.push({ date, isCurrentMonth: true });
  }

  // 다음 달의 날짜들 (마지막 주의 빈 칸 채우기)
  const remainingDays = 42 - calendarDays.length; // 6주 x 7일 = 42칸
  for (let day = 1; day <= remainingDays; day++) {
    const nextDate = new Date(lastDayOfMonth);
    nextDate.setDate(nextDate.getDate() + day);
    calendarDays.push({ date: nextDate, isCurrentMonth: false });
  }

  // 월 이름 가져오기
  const getMonthName = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  // 이전/다음 월 이동
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <Layout showTabBar={true} nickname={user?.name} showFloatingButton={true}>
      <div className=" min-h-screen bg-white flex flex-col pb-20">
        {/* AI 월별 요약 섹션 */}
        <div className="bg-greyBgColor rounded-[20px] p-4 my-6">
          <div className="space-y-2">
            <div className="relative flex items-center gap-1">
              <h2 className="z-10 font-meetme text-[18px] font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px]">
                AI 한마디
              </h2>
              <div className="absolute top-[6px] left-0 z-0">
                <HighlightsIcon width={56} height={15} />
              </div>
            </div>
            <p className="text-[15px] font-pretendard text-[#060607] tracking-[-0.15px] leading-6">
              {hasDataInCurrentMonth
                ? emotionInsight &&
                  (emotionInsight as unknown as EmotionInsightResponse)
                    .monthlyComment
                  ? (emotionInsight as unknown as EmotionInsightResponse)
                      .monthlyComment
                  : '이번 달은 다양한 감정을 경험했어요. 그만큼 나를 더 깊이 알게 됐네요.'
                : '감정을 기록하고 월별 기록을 확인해 보세요'}
            </p>
          </div>
        </div>

        {/* 캘린더 섹션 */}
        <div className="flex-1 flex flex-col px-4 font-meetme">
          {/* 월 헤더 */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded w-6 h-6 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-[24px] font-normal text-black tracking-[-0.24px] leading-[28.8px]">
                {getMonthName(currentDate)}
              </h1>
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded w-6 h-6 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div key={day} className="h-6 flex items-center justify-center">
                  <span
                    className={`text-[17px] font-normal tracking-[-0.17px] leading-[20.4px] ${
                      index === 0 || index === 6
                        ? 'text-[#656a76]'
                        : 'text-black'
                    }`}
                  >
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* 캘린더 그리드 */}
            <div className="flex-1 grid grid-cols-7 gap-1">
              {calendarDays.map(({ date, isCurrentMonth }, index) => {
                const dateString = formatDateOnly(date);
                const emotionData = emotionDataByDate[dateString];
                const isToday = formatDateOnly(new Date()) === dateString;

                return (
                  <div
                    key={index}
                    className={`h-fit flex flex-col items-center justify-center relative ${
                      emotionData ? 'cursor-pointer' : ''
                    }`}
                  >
                    {/* 감정 아이콘 - 현재 달의 날짜에만 표시 */}
                    {isCurrentMonth && (
                      <div className="w-10 h-10 mb-2 flex items-center justify-center">
                        {emotionData ? (
                          emotionData.svgComponent ? (
                            <Link href={`/feed/${emotionData.emotionId}`}>
                              <emotionData.svgComponent
                                width={40}
                                height={40}
                              />
                            </Link>
                          ) : null
                        ) : (
                          // 감정 데이터가 없는 경우 - 빈 원 표시
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <div
                              className={`w-5 h-5 bg-opacity-50 rounded-[5px] ${
                                isToday
                                  ? 'bg-[#D7E4FF]'
                                  : 'text-black bg-[#ECEDEF]'
                              }`}
                            ></div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 날짜 텍스트 - 현재 달의 날짜에만 표시 */}
                    {isCurrentMonth && (
                      <span
                        className={`text-[17px] font-normal tracking-[-0.17px] leading-[20.4px] ${
                          isToday ? 'text-[#6ba1db]' : 'text-black'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
