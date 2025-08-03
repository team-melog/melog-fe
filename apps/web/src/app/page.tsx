"use client";

import { Layout, Button, AIAnalysisResult } from "@melog/ui";
import { useAppStore, useEmotionStore } from "@melog/shared";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { user, theme, setTheme } = useAppStore();
  const { entries } = useEmotionStore();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleEmotionRecord = () => {
    router.push("/emotion");
  };

  return (
    <Layout>
      {/* Mobile-first design */}
      <div className="space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ME:LOG</h1>
          <p className="text-sm text-gray-600 mb-4 px-2">
            하루 1분 만에 감정을 기록하고 AI 분석 결과를 확인해보세요
          </p>
          <Button onClick={toggleTheme} variant="outline" size="sm">
            {theme === "light" ? "🌙" : "☀️"}
          </Button>
        </header>

        <main className="space-y-4">
          {/* 감정 기록 카드 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-gray-100">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              오늘의 감정 기록
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              지금 느끼는 감정을 기록해보세요
            </p>
            <Button className="w-full" onClick={handleEmotionRecord}>
              📝 감정 기록하기
            </Button>
          </div>

          {/* 최근 기록 카드 */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              최근 기록
            </h2>
            {entries.length > 0 ? (
              <div className="space-y-2">
                {entries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{entry.emotion}</p>
                        <div className="flex items-center space-x-2">
                          {entry.voiceNote && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              🎤 음성
                            </span>
                          )}
                          {entry.aiAnalysis && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                              🤖 AI
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        강도: {entry.intensity}/5 •{" "}
                        {entry.timestamp.toLocaleDateString()}
                      </p>
                      {entry.voiceNote && (
                        <p className="text-xs text-gray-600 mt-2 italic line-clamp-2">
                          {entry.voiceNote.length > 50
                            ? entry.voiceNote.substring(0, 50) + "..."
                            : entry.voiceNote}
                        </p>
                      )}
                    </div>

                    {/* AI 분석 결과 표시 */}
                    {entry.aiAnalysis && (
                      <AIAnalysisResult
                        analysis={entry.aiAnalysis}
                        className="ml-3"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-sm text-gray-500">
                  아직 기록된 감정이 없습니다
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  첫 감정을 기록해보세요!
                </p>
              </div>
            )}
          </div>

          {/* 상태 정보 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-xs font-medium text-blue-700">사용자</p>
              <p className="text-xs text-blue-600 truncate">
                {user.name || "미로그인"}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-xs font-medium text-green-700">테마</p>
              <p className="text-xs text-green-600">{theme}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-xs font-medium text-purple-700">기록</p>
              <p className="text-xs text-purple-600">{entries.length}개</p>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
