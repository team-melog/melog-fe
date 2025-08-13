'use client';

import { Layout, Button } from '@melog/ui';
import { useAppStore } from '@melog/shared';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import ProfileIcon from '@/assets/icons/ProfileIcon.svg';
import {
  emotionColorsByStep,
  emotionIconsByStep,
} from '@/entities/emotion/types';
import { svgComponents } from '@/assets/svgs/EmotionSvg';

const testData = {
  content: [
    {
      id: 4,
      date: '2025-08-04',
      summary: '지침과 분노가 반복됨',
      emotions: [
        { type: '설렘', percentage: 90, step: 5 },
        { type: '분노', percentage: 10, step: 1 },
        { type: '슬픔', percentage: 10, step: 1 },
      ],
    },
    {
      id: 20,
      date: '2025-08-03',
      summary: '매우 긍정적인 변화가 나타남',
      emotions: [
        { type: '기쁨', percentage: 40, step: 4 },
        { type: '설렘', percentage: 30, step: 3 },
        { type: '여유', percentage: 30, step: 3 },
      ],
    },
  ],
  page: 0,
  size: 7,
};

export default function FeedPage() {
  const router = useRouter();
  const user = useAppStore(state => state.user);

  // emotion 관련 페이지들 prefetch
  useEffect(() => {
    router.prefetch('/emotion/select');
    router.prefetch('/emotion/record');
    router.prefetch('/emotion/write');
  }, [router]);

  // testData 사용
  const hasData = testData.content.length > 0;
  const dominantEmotion = hasData
    ? testData.content[0]?.emotions[0]?.type
    : null;

  const handleCardClick = (entryId: number) => {
    router.push(`/feed/${entryId}`);
  };

  // 감정 데이터를 카드 형태로 변환
  const emotionCards = testData.content;

  // 각 카드의 배경색을 계산하는 함수
  const getCardBackgroundColor = (card: (typeof testData.content)[0]) => {
    // emotions에서 가장 높은 step을 가진 요소 찾기
    const mainEmotion = card.emotions.reduce((prev, current) =>
      prev.step > current.step ? prev : current
    );

    // emotionColorsByStep에서 해당 감정과 단계에 맞는 색상 가져오기
    const colors =
      emotionColorsByStep[mainEmotion.type as keyof typeof emotionColorsByStep];
    if (colors && colors[mainEmotion.step - 1]) {
      return colors[mainEmotion.step - 1];
    }

    // 기본 색상
    return '#e5e7eb';
  };

  return (
    <Layout showTabBar={true}>
      <div className="font-meetme bg-white flex flex-col min-h-svh">
        {/* Header */}
        <div className="pt-6 px-4 border-b border-gray-200">
          {/* Profile Section */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-white rounded-full mr-4 border border-gray-200 flex items-center justify-center">
              {/* Profile image placeholder */}
              <ProfileIcon />
            </div>
            <div>
              <h1 className="text-2xl font-normal text-black tracking-[-0.26px] leading-[31.2px]">
                {user?.name || '사용자'}
              </h1>
            </div>
          </div>

          {/* Summary Stats Card */}
          <div className="bg-[#F8F8F8] rounded-2xl p-3 mb-6">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-lg font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px]">
                  감정기록
                </p>
                <p className="h-8 text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-6 flex items-center justify-center">
                  {testData.content.length}
                </p>
              </div>
              <div className="w-px h-10 bg-[#ECEDEF]"></div>
              <div className="text-center flex-1">
                <p className="text-lg font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px]">
                  대표감정
                </p>
                {hasData && dominantEmotion ? (
                  <div className="flex items-center justify-center">
                    {(() => {
                      const iconId =
                        emotionIconsByStep[
                          testData.content[0].emotions[0]
                            .type as keyof typeof emotionIconsByStep
                        ]?.[testData.content[0].emotions[0].step - 1];
                      const SvgComponent = iconId
                        ? svgComponents[iconId]
                        : null;

                      if (!SvgComponent) return null;

                      return <SvgComponent width={32} height={32} />;
                    })()}
                  </div>
                ) : (
                  <p className="h-8 text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-6">
                    -
                  </p>
                )}
              </div>
              <div className="w-px h-10 bg-[#ECEDEF]"></div>
              <div className="text-center flex-1">
                <p className="text-lg font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px]">
                  음성녹음
                </p>
                <p className="h-8 text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-6 flex items-center justify-center">
                  0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {!hasData ? (
            /* 기록 전 상태 */
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-md text-black mb-5">
                아직 기록된 감정이 없어요
              </p>
              <Link href="/emotion/select" prefetch={true}>
                <Button className="bg-[#060607] hover:bg-[#2a2a2a] text-white font-normal text-xl py-3 px-16 rounded-[30px] tracking-[-0.2px] transition-colors">
                  감정 기록하러 가기
                </Button>
              </Link>
            </div>
          ) : testData.content.length === 1 ? (
            /* 1개 있을 때 상태 */
            <div className="space-y-4">
              {/* Single Emotion Card */}
              <div className="grid grid-cols-1 gap-1">
                {emotionCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="aspect-square border border-white relative group hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: getCardBackgroundColor(card) }}
                  ></button>
                ))}

                {/* Add New Button */}
                <Link
                  href="/emotion/select"
                  className="aspect-square bg-gray-300 border border-white flex items-center justify-center hover:bg-gray-400 transition-colors"
                  prefetch={true}
                >
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-lg text-white">+</span>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            /* 여러 개 있을 때 상태 */
            <div className="space-y-4">
              {/* Emotion Cards Grid */}
              <div className="grid grid-cols-3 gap-0.5 w-full">
                {emotionCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="aspect-square border border-white relative group hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: getCardBackgroundColor(card) }}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
