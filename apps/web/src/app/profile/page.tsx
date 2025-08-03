'use client'

import { Layout, Button } from '@melog/ui'
import { useAppStore, useEmotionStore } from '@melog/shared'

export default function ProfilePage() {
  const { user, theme, setTheme } = useAppStore()
  const { entries } = useEmotionStore()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // 감정 통계 계산
  const emotionStats = entries.reduce((acc, entry) => {
    acc[entry.emotion] = (acc[entry.emotion] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalEntries = entries.length
  const avgIntensity = totalEntries > 0 
    ? (entries.reduce((sum, entry) => sum + entry.intensity, 0) / totalEntries).toFixed(1)
    : '0'

  return (
    <Layout>
      <div className="space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            👤 마이페이지
          </h1>
          <p className="text-sm text-gray-600">
            내 감정 기록과 설정을 관리하세요
          </p>
        </header>

        <main className="space-y-4">
          {/* 프로필 정보 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-gray-100">
            <div className="text-center">
              <div className="text-4xl mb-2">😊</div>
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name || '감정 기록자'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                ME:LOG와 함께한 감정 여행
              </p>
            </div>
          </div>

          {/* 감정 통계 */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">📊 내 감정 통계</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-xs font-medium text-blue-700">총 기록</p>
                <p className="text-lg font-bold text-blue-600">{totalEntries}개</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-xs font-medium text-green-700">평균 강도</p>
                <p className="text-lg font-bold text-green-600">{avgIntensity}/5</p>
              </div>
            </div>

            {totalEntries > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">감정별 기록</p>
                {Object.entries(emotionStats).map(([emotion, count]) => (
                  <div key={emotion} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-600">{emotion}</span>
                    <span className="text-sm font-medium text-gray-800">{count}회</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 설정 */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">⚙️ 설정</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">테마 설정</span>
                <Button onClick={toggleTheme} variant="outline" size="sm">
                  {theme === 'light' ? '🌙 다크모드' : '☀️ 라이트모드'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">알림 설정</span>
                <span className="text-xs text-gray-500">준비 중</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">데이터 내보내기</span>
                <span className="text-xs text-gray-500">준비 중</span>
              </div>
            </div>
          </div>

          {/* 앱 정보 */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500">ME:LOG v1.0.0</p>
              <p className="text-xs text-gray-400 mt-1">감정을 기록하고 AI로 분석하는 앱</p>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}