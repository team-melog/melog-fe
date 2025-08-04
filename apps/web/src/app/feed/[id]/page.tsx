"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Layout } from "@melog/ui";
import { useEmotionStore } from "@melog/shared";
import { EMOTIONS } from "@melog/shared";

export default function FeedDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { entries, deleteEntry } = useEmotionStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const entryId = params.id as string;
  const entry = entries.find((e) => e.id === entryId);

  if (!entry) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-500">감정 기록을 찾을 수 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            뒤로 가기
          </button>
        </div>
      </Layout>
    );
  }

  const emotionConfig = EMOTIONS[entry.emotion];
  const date = new Date(entry.timestamp);
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  }).format(date);

  const handleDelete = () => {
    deleteEntry(entryId);
    router.push("/feed");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-6 h-6"
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

          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">
              {formattedDate}
            </h1>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* 감정 색상 원 */}
          <div className="flex justify-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: emotionConfig?.color || "#gray-300" }}
            >
              <span className="text-4xl">{emotionConfig?.icon || "😊"}</span>
            </div>
          </div>

          {/* 감정 태그들 */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-semibold">
              {emotionConfig?.name} {entry.intensity * 20}%
            </span>
            {/* 추가 감정 태그들 (실제로는 AI 분석 결과에서 가져올 예정) */}
            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-semibold">
              두려움 30%
            </span>
            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-semibold">
              불안 30%
            </span>
          </div>

          {/* AI 요약 */}
          <div className="bg-gray-100 rounded-xl p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              AI 요약
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {entry.aiAnalysis?.summary ||
                "오늘은 전반적으로 긍정적인 감정을 느끼셨네요. 특히 기쁨의 감정이 많이 나타났습니다."}
            </p>
          </div>

          {/* 음성 재생 버튼 (음성이 있을 때만 표시) */}
          {entry.voiceNote && (
            <div className="flex justify-center">
              <button className="p-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                삭제하시겠습니까?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                이 감정 기록을 삭제하면 복구할 수 없습니다.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
