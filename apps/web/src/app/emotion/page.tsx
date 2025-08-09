'use client';

import { Layout, Button } from '@melog/ui';
import { useAppStore } from '@melog/shared';
import { useRouter } from 'next/navigation';
import LottieSelectCharacters from '@/components/lotties/LottieSelectCharacters';
import { useEmotionList } from '@/features/emotion';
import { svgComponents } from '@/assets/svgs/EmotionSvg';

export default function EmotionPage() {
  const router = useRouter();
  const { user } = useAppStore();
  // const { data: nickname } = useGetNickname(user?.name || '');
  const { data: createRecord } = useEmotionList(user?.name || undefined, 0, 7);

  // 현재 날짜 정보
  const today = new Date();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dayNumOfWeek = daysOfWeek.map(day => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + daysOfWeek.indexOf(day));
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
  });

  const emotionIcons = {
    기쁨: ['Yellow1', 'Yellow2', 'Yellow3', 'Yellow4', 'Yellow5'],
    설렘: ['Pink1', 'Pink2', 'Pink3', 'Pink4', 'Pink5'],
    평온: ['Green1', 'Green2', 'Green3', 'Green4', 'Green5'],
    분노: ['Red1', 'Red2', 'Red3', 'Red4', 'Red5'],
    슬픔: ['Blue1', 'Blue2', 'Blue3', 'Blue4', 'Blue5'],
    지침: ['Grey1', 'Grey2', 'Grey3', 'Grey4', 'Grey5'],
  };

  // 날짜에 해당하는 감정 데이터 찾기
  const getEmotionForDate = (date: string) => {
    if (createRecord && 'content' in createRecord) {
      const record = createRecord as {
        content: Array<{
          date: string;
          emotions: Array<{ type: string; percentage: number; step: number }>;
        }>;
      };
      const emotionData = record.content.find(item => item.date === date);
      return emotionData?.emotions?.[0] || null;
    }
    return null;
  };

  const handleEmotionRecord = () => {
    // 감정 기록 화면으로 이동 (색 선택 화면)
    router.push('/emotion/select');
  };

  return (
    <Layout showTabBar={true}>
      <div className="min-h-svh font-meetme bg-white flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col py-6">
          {/* Calendar Bar */}
          <div className="h-[125px] rounded-xl py-3 px-4 mb-6 border-2 border-[#D0D2D7] flex flex-col justify-between">
            <span className="text-lg">지난 일주일</span>
            <div className="flex justify-between items-center">
              {daysOfWeek.map((day, index) => {
                const date = dayNumOfWeek[index];
                const emotionData = getEmotionForDate(date);

                return (
                  <div key={day} className="flex flex-col items-center">
                    <div className="relative">
                      {/* 감정 SVG 표시 */}
                      {emotionData &&
                        (() => {
                          const iconId =
                            emotionIcons[
                              emotionData.type as keyof typeof emotionIcons
                            ]?.[emotionData.step - 1];
                          const SvgComponent = iconId
                            ? svgComponents[iconId]
                            : null;

                          if (!SvgComponent) return null;

                          return (
                            <div className="absolute -top-1 -left-1 w-[40px] h-[40px]">
                              <SvgComponent width={40} height={40} />
                            </div>
                          );
                        })()}
                      {/* 요일 원형 */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 text-[#B5B8C0]">
                        {day}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {new Date(date).getDate()}
                    </div>
                  </div>
                );
              })}
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
