"use client";

import { useMemo } from "react";
import { Layout } from "@melog/ui";
import { useAppStore, useEmotionStore, EMOTIONS } from "@melog/shared";

export default function ProfilePage() {
  const { user } = useAppStore();
  const { entries } = useEmotionStore();

  // 감정 기록이 있는지 확인
  const hasEmotionData = entries.length > 0;

  // 사용자 가입일부터 현재까지의 일수 계산
  const daysSinceJoin = useMemo(() => {
    // 임시로 2025년 1월 1일부터 계산 (실제로는 사용자 가입일을 사용)
    const joinDate = new Date("2025-01-01");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  // 현재 월의 감정 데이터 분석
  const monthlyStats = useMemo(() => {
    if (!hasEmotionData) return null;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // 현재 월의 감정 데이터만 필터링
    const monthlyEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });

    if (monthlyEntries.length === 0) return null;

    // 감정별 개수 계산
    const emotionCounts: { [key: string]: number } = {};
    monthlyEntries.forEach((entry) => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
    });

    // 감정별 비율 계산
    const totalEntries = monthlyEntries.length;
    const emotionPercentages = Object.entries(emotionCounts).map(
      ([emotion, count]) => ({
        emotion,
        percentage: Math.round((count / totalEntries) * 100),
        count,
        color: EMOTIONS[emotion as keyof typeof EMOTIONS]?.color || "#gray-300",
        name: EMOTIONS[emotion as keyof typeof EMOTIONS]?.name || emotion,
      })
    );

    // 비율 순으로 정렬
    emotionPercentages.sort((a, b) => b.percentage - a.percentage);

    return {
      totalEntries,
      emotionPercentages: emotionPercentages.slice(0, 4), // 상위 4개만 표시
    };
  }, [entries, hasEmotionData]);

  // 감정 키워드 분석 (실제로는 AI 분석 결과에서 가져올 예정)
  const emotionKeywords = useMemo(() => {
    if (!hasEmotionData) return [];

    // 임시 키워드 데이터
    return [
      { keyword: "지침", count: 8 },
      { keyword: "혼란", count: 3 },
      { keyword: "의지", count: 2 },
    ];
  }, [hasEmotionData]);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* 프로필 섹션 */}
        <div className="px-4 py-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {user?.name || "닉네임명"}
              </h1>
            </div>
          </div>

          {/* 함께한 지 X일 째 */}
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              함께한 지 {daysSinceJoin}일 째
            </p>
          </div>
        </div>

        {/* 이 달의 요약 섹션 */}
        <div className="px-4 pb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            이 달의 요약
          </h2>

          {!hasEmotionData || !monthlyStats ? (
            /* 감정 기록이 없는 버전 */
            <div className="text-center py-8">
              <p className="text-sm text-gray-600">아직 기록된 감정이 없어요</p>
            </div>
          ) : (
            /* 감정 기록이 있는 버전 */
            <div className="space-y-6">
              {/* 감정 분포도 */}
              <div className="bg-gray-100 rounded-xl p-4">
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  감정 분포도
                </h3>

                {/* 바 차트 */}
                <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div className="flex h-full">
                    {monthlyStats.emotionPercentages.map((emotion) => (
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
                  {monthlyStats.emotionPercentages.map((emotion) => (
                    <div
                      key={emotion.emotion}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: emotion.color }}
                        />
                        <span className="text-sm text-gray-700">
                          {emotion.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {emotion.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 주요 감정 키워드 */}
              <div className="bg-gray-100 rounded-xl p-4">
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  주요 감정 키워드
                </h3>
                <div className="flex flex-wrap gap-2">
                  {emotionKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">
                        {keyword.keyword}
                      </span>
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs text-gray-600">
                        {keyword.count}회
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
