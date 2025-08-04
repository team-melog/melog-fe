"use client";

import { Layout, Button } from "@melog/ui";
import { useAppStore } from "@melog/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmotionResultPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [selectedOption, setSelectedOption] = useState<
    "keep" | "change" | null
  >(null);

  // 더미 감정 분석 결과 데이터
  const emotionResults = [
    { emotion: "기쁨", percentage: 40, color: "#f3c96b" },
    { emotion: "두려움", percentage: 30, color: "#896baf" },
    { emotion: "불안", percentage: 30, color: "#2196f3" },
  ];

  const mainEmotionColor = "#f3c96b"; // 기쁨 색상
  const aiSummary =
    "오늘은 기쁨이 40%로 가장 높게 나타났습니다. 새로운 경험에 대한 설렘과 함께 약간의 불안감도 느끼고 계시는 것 같아요. 이런 감정 조합은 자연스러운 반응이며, 적절한 대처를 통해 긍정적으로 활용할 수 있습니다.";

  const handleKeepColor = () => {
    setSelectedOption("keep");
    // 기존 색 유지 후 다음 화면으로 이동
    router.push("/emotion/final");
  };

  const handleChangeColor = () => {
    setSelectedOption("change");
    // 추천 색으로 변경 후 다음 화면으로 이동
    router.push("/emotion/final");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center px-4 py-6">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center"
          >
            <span className="text-2xl">←</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-center text-black mb-8 leading-tight">
            AI 분석결과
            <br />
            {user?.name || "사용자"}님은 ________색이에요
          </h1>

          {/* Emotion Visualization */}
          <div className="flex flex-col items-center mb-8">
            {/* Main Emotion Circle */}
            <div className="relative mb-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: mainEmotionColor }}
              >
                <span className="text-white font-semibold">기쁨</span>
              </div>

              {/* Secondary Emotion Circles */}
              <div
                className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full"
                style={{ backgroundColor: "#896baf" }}
              />
              <div
                className="absolute -top-2 -right-2 w-14 h-14 rounded-full"
                style={{ backgroundColor: "#2196f3" }}
              />
            </div>
          </div>

          {/* Emotion Percentages */}
          <div className="flex justify-center space-x-2 mb-6">
            {emotionResults.map((result, index) => (
              <div key={index} className="bg-gray-300 rounded-lg px-3 py-2">
                <span className="text-sm font-semibold text-black">
                  {result.emotion} {result.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* AI Summary */}
          <div className="bg-gray-300 rounded-lg p-4 mb-8">
            <h3 className="text-base font-semibold text-black mb-2">AI 요약</h3>
            <p className="text-sm text-black leading-relaxed">{aiSummary}</p>
          </div>

          {/* Color Selection Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleKeepColor}
              className={`w-full py-3 rounded-lg font-semibold text-base transition-colors ${
                selectedOption === "keep"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
            >
              기존 색 유지하기
            </Button>

            <Button
              onClick={handleChangeColor}
              className={`w-full py-3 rounded-lg font-semibold text-base transition-colors ${
                selectedOption === "change"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
            >
              추천 색으로 변경하기
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
