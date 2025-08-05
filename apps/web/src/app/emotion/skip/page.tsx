"use client";

import { Layout } from "@melog/ui";
import { useAppStore } from "@melog/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmotionSkipPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [selectedOption, setSelectedOption] = useState<"voice" | "text" | null>(
    null
  );

  const handleVoiceSelect = () => {
    setSelectedOption("voice");
    // 녹음 화면으로 이동
    router.push("/emotion/record");
  };

  const handleTextSelect = () => {
    setSelectedOption("text");
    // 텍스트 입력 화면으로 이동
    router.push("/emotion/write");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center py-6">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center"
          >
            <span className="text-2xl">←</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-center text-black mb-12 leading-tight">
            {user?.name || "사용자"}님의 이야기를 먼저 듣고
            <br />
            감정을 분석해드릴게요!
          </h1>

          {/* Selection Options */}
          <div className="flex space-x-8 mb-12">
            {/* Voice Recording Option */}
            <button
              onClick={handleVoiceSelect}
              className={`flex flex-col items-center space-y-4 transition-all ${
                selectedOption === "voice" ? "scale-105" : "hover:scale-102"
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
                  selectedOption === "voice"
                    ? "bg-gray-400"
                    : "bg-gray-300 hover:bg-gray-350"
                }`}
              >
                <span className="text-2xl">🎤</span>
              </div>
              <span className="text-xl font-semibold text-black">녹음</span>
            </button>

            {/* Text Input Option */}
            <button
              onClick={handleTextSelect}
              className={`flex flex-col items-center space-y-4 transition-all ${
                selectedOption === "text" ? "scale-105" : "hover:scale-102"
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
                  selectedOption === "text"
                    ? "bg-gray-400"
                    : "bg-gray-300 hover:bg-gray-350"
                }`}
              >
                <span className="text-2xl">✏️</span>
              </div>
              <span className="text-xl font-semibold text-black">텍스트</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center text-gray-600 max-w-xs">
            <p className="text-sm">
              음성으로 녹음하거나 텍스트로 직접 작성할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
