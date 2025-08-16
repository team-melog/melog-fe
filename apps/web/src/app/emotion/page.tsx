'use client';

import { Layout } from '@melog/ui';
import { useAppStore } from '@/features/store';
import { useEmotionList } from '@/features/emotion';
import { svgComponents } from '@/assets/svgs/emotions/EmotionSvg';
import { emotionIconsByStep } from '@/entities/emotion/types';
import Yellow5 from '@/assets/svgs/emotions/Yellow5';
import Green5 from '@/assets/svgs/emotions/Green5';
import Pink5 from '@/assets/svgs/emotions/Pink5';
import HighlightsIcon from '@/assets/svgs/common/HighlightsIcon';
import Link from 'next/link';

export default function EmotionPage() {
  const nickname = useAppStore(state => state.user.name);
  const { data: emotionWeekList } = useEmotionList(nickname, 0, 7);

  // 현재 날짜 정보
  const today = new Date();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dayNumOfWeek = daysOfWeek.map(day => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + daysOfWeek.indexOf(day));
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
  });

  // 날짜에 해당하는 감정 데이터 찾기
  const getEmotionForDate = (date: string) => {
    if (emotionWeekList && 'content' in emotionWeekList) {
      const record = emotionWeekList as {
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

  // emotionWeekList 유무에 따라 다른 UI 표시
  const hasEmotionData =
    emotionWeekList &&
    'content' in emotionWeekList &&
    Array.isArray((emotionWeekList as { content: unknown[] }).content) &&
    (emotionWeekList as { content: unknown[] }).content.length > 0;
  const isFirstTime = !hasEmotionData;

  return (
    <Layout
      showTabBar={true}
      nickname={nickname}
      className="bg-greyBgColor"
      showFloatingButton={true}
      showFloatingButtonBorder={isFirstTime}
    >
      <div className="min-h-svh font-meetme bg-greyBgColor flex flex-col px-4">
        {/* Main Content */}
        <div className="flex-1 flex flex-col pb-6 pt-2 sm:pt-6">
          {/* Calendar Bar */}
          <Link
            href="/calendar"
            className="h-[125px] rounded-xl py-3 px-4 mb-3 bg-white flex flex-col justify-between"
          >
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
                            emotionIconsByStep[
                              emotionData.type as keyof typeof emotionIconsByStep
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
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[18px] mb-2 text-[#B5B8C0] bg-[#ECEDEF] ">
                        {day}
                      </div>
                    </div>
                    <div className="text-[17px] text-[#7E8391]">
                      {new Date(date).getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </Link>

          {/* AI의 한마디 카드 */}
          <div className="min-h-[82px] max-h-[106px] bg-[#ecedef] rounded-[20px] p-4 mb-3 relative">
            <div>
              <div className="relative flex items-center gap-1">
                <h3 className="z-10 text-lg font-meetme text-[#36393f]">
                  AI의 한마디
                </h3>
                <div className="absolute top-[9px] left-0 z-0">
                  <HighlightsIcon width={66} height={15} />
                </div>
              </div>
              <div className="text-[15px] font-pretendard text-[#060607] leading-6 font-medium text-sm">
                {isFirstTime
                  ? '오늘의 복잡한 감정을 미로그에 기록해 볼까요?'
                  : '이번 달은 다양한 감정을 경험했어요. 그만큼 나를 더 깊이 알게 됐네요.'}
              </div>
            </div>
          </div>

          {/* 이번주 챌린지 섹션 */}
          <div className="mb-6 pb-6">
            <h3 className="text-[15px] font-pretendard text-[#4e515b] mb-3">
              이번주 챌린지
            </h3>
            <div className="space-y-2">
              {/* 출석체크 챌린지 */}
              <Link
                href="/calendar"
                className="h-[90px] bg-[#ffdef1] rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="w-full flex justify-between items-center">
                  <div>
                    <h4 className="text-[17px] font-meetme text-black">
                      출석체크
                    </h4>
                    <p className="text-[13px] font-medium text-[#656a76] leading-5 font-pretendard">
                      3일 연속 감정 기록하기
                    </p>
                  </div>
                  <Pink5 width={40} height={40} />
                </div>
              </Link>

              {/* 감정 패턴 보기 챌린지 */}
              <Link
                href="/calendar"
                className="h-[90px] bg-[#fff5ca] rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="w-full flex justify-between items-center">
                  <div>
                    <h4 className="text-[17px] font-meetme text-black">
                      감정 패턴 보기
                    </h4>
                    <p className="text-[13px] font-medium text-[#656a76] leading-5 font-pretendard">
                      감정 변화 패턴 찾아보기
                    </p>
                  </div>
                  <Yellow5 width={40} height={40} />
                </div>
              </Link>

              {/* 이너피스 챌린지 */}
              <Link
                href="/calendar"
                className="h-[90px] bg-[#ccffe4] rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="w-full flex justify-between items-center">
                  <div>
                    <h4 className="text-[17px] font-meetme text-black">
                      이너피스
                    </h4>
                    <p className="text-[13px] font-medium text-[#656a76] leading-5 font-pretendard">
                      평온한 하루 2번 만들기
                    </p>
                  </div>
                  <Green5 width={40} height={40} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
