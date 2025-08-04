"use client";

import { Layout, Button } from "@melog/ui";
import { useRouter } from "next/navigation";

export default function EmotionFinalPage() {
  const router = useRouter();

  // 현재 날짜 정보
  const today = new Date();
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const currentDay = daysOfWeek[today.getDay()];
  const formattedDate = `${today.getFullYear()}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}.${String(today.getDate()).padStart(
    2,
    "0"
  )}. ${currentDay}요일`;

  // 더미 감정 분석 결과 데이터
  const emotionResults = [
    { emotion: "기쁨", percentage: 40 },
    { emotion: "두려움", percentage: 30 },
    { emotion: "불안", percentage: 30 },
  ];

  const aiSummary =
    "오늘은 기쁨이 40%로 가장 높게 나타났습니다. 새로운 경험에 대한 설렘과 함께 약간의 불안감도 느끼고 계시는 것 같아요. 이런 감정 조합은 자연스러운 반응이며, 적절한 대처를 통해 긍정적으로 활용할 수 있습니다.";

  const handleConfirm = () => {
    // 홈 화면으로 이동
    router.push("/emotion");
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          {/* Result Card */}
          <div className="w-full max-w-sm bg-gray-300 rounded-lg p-6">
            {/* Date */}
            <div className="text-center mb-4">
              <p className="text-base font-semibold text-black">
                {formattedDate}
              </p>
            </div>

            {/* Emotion Circle */}
            <div className="flex justify-center mb-6">
              <div className="w-44 h-44 bg-white rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            {/* Emotion Percentages */}
            <div className="flex justify-center space-x-2 mb-4">
              {emotionResults.map((result, index) => (
                <div key={index} className="bg-white rounded px-3 py-1">
                  <span className="text-xs font-semibold text-black">
                    {result.emotion} {result.percentage}%
                  </span>
                </div>
              ))}
            </div>

            {/* AI Summary */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="text-base font-semibold text-black mb-2">
                AI 요약
              </h3>
              <p className="text-sm text-black leading-relaxed">{aiSummary}</p>
            </div>

            {/* Confirm Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleConfirm}
                className="bg-white hover:bg-gray-100 text-black font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
