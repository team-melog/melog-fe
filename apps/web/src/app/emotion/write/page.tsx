"use client";

import { Layout, Button } from "@melog/ui";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EmotionWritePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // 키보드 표시 여부 감지 (간단한 구현)
  useEffect(() => {
    const handleResize = () => {
      // 화면 높이가 줄어들면 키보드가 올라온 것으로 간주
      const isVisible = window.innerHeight < window.outerHeight * 0.8;
      setIsKeyboardVisible(isVisible);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    if (text.trim()) {
      // 텍스트 저장 후 감정 분석 화면으로 이동
      router.push("/emotion/analysis");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isTextValid = text.trim().length > 0;

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
        <div className="flex-1 flex flex-col px-4">
          {/* Text Input Area */}
          <div className="flex-1 flex flex-col">
            {/* Title */}
            <h1 className="text-xl font-medium text-black mb-6 text-center">
              텍스트를 작성해주세요
            </h1>

            {/* Text Input */}
            <div className="flex-1 bg-gray-100 rounded-lg p-4 mb-4">
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="오늘의 감정에 대해 자유롭게 작성해주세요..."
                className="w-full h-full bg-transparent border-none outline-none resize-none text-black placeholder-gray-500"
                style={{ minHeight: "300px" }}
              />
            </div>
          </div>

          {/* Save Button - 키보드 위에 고정 */}
          <div
            className={`py-4 transition-all duration-300 ${
              isKeyboardVisible ? "pb-8" : ""
            }`}
          >
            <Button
              onClick={handleSave}
              disabled={!isTextValid}
              className={`w-full py-3 rounded-lg font-semibold text-base transition-colors ${
                isTextValid
                  ? "bg-gray-400 hover:bg-gray-500 text-black"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
