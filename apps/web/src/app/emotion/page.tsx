'use client';

import { Layout, Button } from '@melog/ui';
import { useAppStore } from '@melog/shared';
import { useRouter } from 'next/navigation';
import LottieSelectCharacters from '@/components/lotties/LottieSelectCharacters';
// import { useGetNickname } from '@/features/user/hooks/useUserApi';

export default function EmotionPage() {
  const router = useRouter();
  const { user } = useAppStore();
  // const { data: nickname } = useGetNickname(user?.name || '');

  const handleEmotionRecord = () => {
    // 감정 기록 화면으로 이동 (색 선택 화면)
    router.push('/emotion/select');
  };

  // const toggleTheme = () => {
  //   setTheme(theme === 'light' ? 'dark' : 'light');
  // };

  // 현재 날짜 정보
  const today = new Date();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <Layout showTabBar={true}>
      <div className="min-h-svh font-meetme bg-white flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col py-6">
          {/* Calendar Bar */}
          <div className="h-[125px] rounded-xl py-3 px-4 mb-6 border-2 border-[#D0D2D7] flex flex-col justify-between">
            <span className="text-lg">지난 일주일</span>
            <div className="flex justify-between items-center">
              {daysOfWeek.map((day, index) => (
                <div key={day} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 text-[#B5B8C0]`}
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

          <div className="h-[calc(90svh-225px)] flex flex-col justify-between">
            {/* Main Title */}
            <h1 className="text-3xl text-center text-black leading-tight">
              오늘 &nbsp;
              <span className="border-b-2 border-[black]">
                {user?.name || '사용자'}님의 감정
              </span>
              에 <br />
              가장 가까운 색은?
            </h1>

            {/* Main Illustration */}
            <div className="flex justify-center">
              <div className="w-40 h-40">
                <LottieSelectCharacters />
              </div>
            </div>

            {/* Record Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleEmotionRecord}
                className="w-3/5 bg-[#060607] hover:bg-[#2a2a2a] text-white py-3 px-8 rounded-3xl transition-colors text-xl"
              >
                색상 선택하기
              </Button>
            </div>
          </div>
        </div>

        {/* Theme Toggle (Hidden by default) */}
        {/* <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 p-2 bg-gray-200 rounded-full opacity-50 hover:opacity-100 transition-opacity"
          title="테마 변경"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button> */}
      </div>
    </Layout>
  );
}
