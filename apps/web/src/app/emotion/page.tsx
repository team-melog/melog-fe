'use client';

import { Layout, Button } from '@melog/ui';
import { useAppStore } from '@melog/shared';
import { useRouter } from 'next/navigation';

export default function EmotionPage() {
  const router = useRouter();
  const { user, theme, setTheme } = useAppStore();

  const handleEmotionRecord = () => {
    // 감정 기록 화면으로 이동 (색 선택 화면)
    router.push('/emotion/select');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 현재 날짜 정보
  const today = new Date();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <Layout showTabBar={true}>
      <div className="min-h-screen font-meetme bg-white flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4 py-6">
          {/* Calendar Bar */}
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              {daysOfWeek.map((day, index) => (
                <div key={day} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${
                      index === today.getDay() ? 'bg-gray-300' : 'bg-gray-200'
                    }`}
                  >
                    {day}
                  </div>
                  <div className="text-sm font-medium">
                    {today.getDate() - today.getDay() + index}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl text-center text-black mb-8 leading-tight">
            오늘 {user?.name || '사용자'}님의 감정에 <br />
            가장 가까운 색은?
          </h1>

          {/* Main Illustration */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-36 h-36 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
          </div>

          {/* Record Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleEmotionRecord}
              className="bg-gray-400 hover:bg-gray-500 text-black py-3 px-8 rounded-lg transition-colors text-xl"
            >
              색상 선택하기
            </Button>
          </div>
        </div>

        {/* Theme Toggle (Hidden by default) */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 p-2 bg-gray-200 rounded-full opacity-50 hover:opacity-100 transition-opacity"
          title="테마 변경"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </Layout>
  );
}
