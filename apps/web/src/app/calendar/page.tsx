"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@melog/ui";
import { useEmotionStore } from "@melog/shared";
import { EMOTIONS } from "@melog/shared";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { entries } = useEmotionStore();
  const router = useRouter();

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

  // 날짜를 YYYY-MM-DD 형식으로 변환 (시간 제외)
  const formatDateOnly = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 현재 월의 감정 데이터 매핑
  const emotionDataByDate = useMemo(() => {
    const data: { [key: string]: { emotion: string; color: string } } = {};

    entries.forEach((entry) => {
      const dateKey = formatDateOnly(entry.timestamp);
      const emotionConfig = EMOTIONS[entry.emotion];

      if (emotionConfig) {
        data[dateKey] = {
          emotion: entry.emotion,
          color: emotionConfig.color,
        };
      }
    });

    return data;
  }, [entries]);

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
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
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
    <Layout>
      <div className="space-y-6">
        {/* AI 월별 요약 섹션 */}
        <div className="bg-gray-100 rounded-xl p-4">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">AI 월별 요약</h2>
            <p className="text-sm text-gray-700">
              이번 달에는 기쁨이 늘고 분노가 줄었어요.
            </p>
          </div>
        </div>

        {/* 캘린더 섹션 */}
        <div className="space-y-4">
          {/* 월 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-gray-900">
                {getMonthName(currentDate)}
              </h1>
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded"
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
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded"
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

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">{day}</span>
              </div>
            ))}
          </div>

          {/* 캘린더 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              const dateString = formatDateOnly(date);
              const emotionData = emotionDataByDate[dateString];
              const isToday = formatDateOnly(new Date()) === dateString;

              // 해당 날짜의 감정 엔트리 찾기
              const dayEntries = entries.filter((entry) => {
                const entryDate = formatDateOnly(entry.timestamp);
                return entryDate === dateString;
              });

              return (
                <div
                  key={index}
                  className={`aspect-square flex flex-col items-center justify-center relative ${
                    emotionData ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                  onClick={() => {
                    if (dayEntries.length > 0) {
                      // 첫 번째 엔트리로 이동 (여러 개가 있을 경우)
                      router.push(`/feed/${dayEntries[0].id}`);
                    }
                  }}
                >
                  {/* 감정 색상 원 - 피드 데이터가 있을 때만 표시 */}
                  {emotionData && (
                    <div
                      className="absolute top-1 w-10 h-10 rounded-full opacity-80"
                      style={{ backgroundColor: emotionData.color }}
                    />
                  )}

                  {/* 날짜 텍스트 */}
                  <span
                    className={`text-sm font-medium relative z-10 ${
                      isCurrentMonth
                        ? isToday
                          ? "text-blue-600 font-bold"
                          : "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
