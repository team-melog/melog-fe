"use client";

import { Layout, Button } from "@melog/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { emotions, intensityLabels } from "@melog/shared";

interface EmotionSelection {
  emotion: string;
  intensity: number;
  color: string;
}

export default function EmotionSelectPage() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] =
    useState<EmotionSelection | null>(null);

  const handleEmotionSelect = (
    emotionName: string,
    intensity: number,
    color: string
  ) => {
    setSelectedEmotion({
      emotion: emotionName,
      intensity: intensity + 1, // 1-5 강도로 변환
      color: color,
    });
  };

  const handleSkip = () => {
    // 건너뛰기 시 건너뛰기 전용 화면으로 이동
    router.push("/emotion/skip");
  };

  const handleNext = () => {
    if (selectedEmotion) {
      // 선택된 감정 정보를 URL 파라미터로 전달
      const params = new URLSearchParams({
        emotion: selectedEmotion.emotion,
        intensity: selectedEmotion.intensity.toString(),
        color: selectedEmotion.color,
      });
      router.push(`/emotion/input?${params.toString()}`);
    }
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center py-6">
          <button
            onClick={() => router.back()}
            className="w-6 h-6 flex items-center justify-center"
          >
            <span className="text-2xl">←</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Title */}
          <h1 className="text-xl font-semibold text-center text-black mb-10">
            오늘은 &nbsp;
            {selectedEmotion ? (
              <span>
                {selectedEmotion?.intensity &&
                  intensityLabels[selectedEmotion?.intensity - 1]}
                &nbsp;
                {selectedEmotion?.emotion}
              </span>
            ) : (
              <span>_______</span>
            )}
          </h1>

          {/* Emotion Grid */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {emotions.map((emotion) => (
              <div key={emotion.name} className="space-y-2">
                {/* Emotion Name */}
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-black w-12">
                    {emotion.name}
                  </span>

                  {/* Intensity Labels */}
                  <div className="flex-1 flex justify-between px-2">
                    {intensityLabels.map((label) => (
                      <span
                        key={label}
                        className="text-xs font-medium text-black whitespace-nowrap"
                        style={{ width: "40px", textAlign: "center" }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Color Circles */}
                <div className="flex justify-between items-center">
                  <div className="w-12"></div> {/* Spacer for emotion name */}
                  <div className="flex-1 flex justify-between px-2">
                    {emotion.colors.map((color, intensityIndex) => (
                      <button
                        key={intensityIndex}
                        onClick={() =>
                          handleEmotionSelect(
                            emotion.name,
                            intensityIndex,
                            color
                          )
                        }
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedEmotion?.emotion === emotion.name &&
                          selectedEmotion?.intensity === intensityIndex + 1
                            ? "border-black scale-110"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Buttons */}
          <div className="py-4 space-y-3 flex-shrink-0">
            {selectedEmotion && (
              <Button
                onClick={handleNext}
                className="w-full bg-gray-400 hover:bg-gray-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                다음
              </Button>
            )}

            <Button
              onClick={handleSkip}
              className="w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              건너뛰기
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
