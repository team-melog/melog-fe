'use client';

import { useState, useMemo } from 'react';
import { Layout } from '@melog/ui';
import { useAppStore } from '@/features/store';
import { useEmotionMonthly } from '@/features/emotion/hooks/useEmotionApi';
import { svgComponents } from '@/assets/svgs/EmotionSvg';
import { emotionIconsByStep } from '@/entities/emotion/types';
import Link from 'next/link';

// 날짜를 YYYY-MM-DD 형식으로 변환 (시간 제외)
const formatDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const testData = [
  {
    id: 1,
    date: '2025-08-01',
    emotions: [
      { type: '지침', percentage: 70, step: 4 },
      { type: '평온', percentage: 20, step: 1 },
      { type: '분노', percentage: 10, step: 1 },
    ],
  },
  {
    id: 2,
    date: '2025-08-02',
    emotions: [
      { type: '분노', percentage: 60, step: 3 },
      { type: '설렘', percentage: 30, step: 2 },
      { type: '기쁨', percentage: 10, step: 1 },
    ],
  },
  {
    id: 3,
    date: '2025-08-11',
    emotions: [
      { type: '평온', percentage: 70, step: 4 },
      { type: '기쁨', percentage: 10, step: 1 },
      { type: '슬픔', percentage: 9, step: 1 },
    ],
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useAppStore();
  const { data: emotionMonthly } = useEmotionMonthly(
    user?.name || '',
    formatDateOnly(currentDate).slice(0, 7)
  );

  // 데이터 매핑
  const testEmotionDataByDate = useMemo(() => {
    const data: {
      [key: string]: {
        id: number;
        emotion: string;
        step: number;
        svgComponent: React.ComponentType<{ width?: number; height?: number }>;
      };
    } = {};

    testData.forEach(dayData => {
      // 가장 높은 percentage를 가진 감정을 메인 감정으로 선택
      const mainEmotion = dayData.emotions.reduce((prev, current) =>
        prev.percentage > current.percentage ? prev : current
      );

      // emotionIcons에서 해당 감정과 단계에 맞는 SVG 컴포넌트 찾기
      const iconKey =
        emotionIconsByStep[
          mainEmotion.type as keyof typeof emotionIconsByStep
        ]?.[mainEmotion.step - 1];
      const svgComponent = iconKey ? svgComponents[iconKey] : null;

      if (svgComponent) {
        data[dayData.date] = {
          id: dayData.id,
          emotion: mainEmotion.type,
          step: mainEmotion.step,
          svgComponent: svgComponent,
        };
      }
    });

    return data;
  }, [testData]);

  console.log('emotionMonthly', emotionMonthly);

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
        id: number;
        emotion: string;
        svgComponent?: React.ComponentType<{ width?: number; height?: number }>;
      };
    } = {};

    Object.keys(testEmotionDataByDate).forEach(dateKey => {
      const item = testEmotionDataByDate[dateKey];
      data[dateKey] = {
        id: item.id,
        emotion: item.emotion,
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
    <Layout showTabBar={true} nickname={user?.name}>
      <div className=" min-h-screen bg-white flex flex-col pb-20">
        {/* AI 월별 요약 섹션 */}
        <div className="bg-white border border-[#d0d2d7] rounded-[20px] p-4 my-6">
          <div className="space-y-2">
            <h2 className="font-meetme text-[18px] font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px]">
              AI 조언
            </h2>
            <p className="text-[15px] font-pretendard text-[#060607] tracking-[-0.15px] leading-6">
              {hasDataInCurrentMonth
                ? '이번 달에는 기쁨이 늘고 분노가 줄었어요.'
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
                            <Link href={`/feed/${emotionData.id}`}>
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
