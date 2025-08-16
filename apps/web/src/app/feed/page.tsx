'use client';

import { Layout } from '@melog/ui';
import { useAppStore } from '@/features/store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ProfileIcon from '@/assets/icons/ProfileIcon.svg';
import {
  emotionColorsByStep,
  emotionIconsByStep,
} from '@/entities/emotion/types';
import { svgComponents } from '@/assets/svgs/emotions/EmotionSvg';
import { faceSvgComponents } from '@/assets/svgs/faces/FaceSvg';
import { useEmotionList } from '@/features';
import { EmotionListResponse } from '@/features/emotion/api/types';
import PlayingIcon from '@/assets/svgs/common/PlayingIcon';

interface EmotionList {
  content: {
    id: number;
    date: string;
    summary: string;
    emotions: {
      id: number;
      percentage: number;
      step: number;
      type: string;
    }[];
  }[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function FeedPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const { data: emotionList } = useEmotionList(user?.name, 0, 12);
  const [svgSize, setSvgSize] = useState(50);
  const gridRef = useRef<HTMLDivElement>(null);

  // 타입 안전성을 위한 타입 가드
  const emotionData = emotionList as unknown as EmotionListResponse;

  // emotion 관련 페이지들 prefetch
  useEffect(() => {
    router.prefetch('/emotion/select');
    router.prefetch('/emotion/record');
    router.prefetch('/emotion/write');
  }, [router]);

  // 그리드 크기에 따라 SVG 크기 조정
  useEffect(() => {
    const updateSvgSize = () => {
      if (gridRef.current) {
        const gridWidth = gridRef.current.offsetWidth;
        const cardSize = gridWidth / 3; // 3열 그리드이므로
        const newSvgSize = cardSize; // 카드 크기의 80% 또는 최대 120px
        setSvgSize(newSvgSize);
      }
    };

    updateSvgSize();
    window.addEventListener('resize', updateSvgSize);

    return () => window.removeEventListener('resize', updateSvgSize);
  }, [emotionData?.content?.length]);

  // emotionList 사용 - 안전한 접근
  const hasData = emotionData?.content && emotionData.content.length > 0;
  const dominantEmotion = hasData
    ? emotionData?.content[0]?.emotions[0]?.type
    : null;

  const handleCardClick = (entryId: number) => {
    router.push(`/feed/${entryId}`);
  };

  // 감정 데이터를 카드 형태로 변환
  const emotionCards = emotionData?.content;

  // 각 카드의 배경색을 계산하는 함수
  const getCardBackgroundColor = (card: EmotionList['content'][0]) => {
    if (!card.emotions || card.emotions.length === 0) return '#e5e7eb';
    // emotions에서 가장 높은 percentage을 가진 요소 찾기
    const mainEmotion = card.emotions.reduce((prev, current) =>
      prev.percentage > current.percentage ? prev : current
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
    <Layout showTabBar={true} nickname={user?.name} showFloatingButton={true}>
      <div className="font-meetme bg-white flex flex-col min-h-svh">
        {/* Header */}
        <div className="pt-6 px-4 border-b border-gray-200">
          {/* Profile Section */}
          <div className="flex items-center mb-6">
            <div className="rounded-full mr-4 flex items-center justify-center">
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
                  {emotionData?.content?.length || 0}
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
                          emotionData.content[0].emotions[0]
                            .type as keyof typeof emotionIconsByStep
                        ]?.[emotionData.content[0].emotions[0].step - 1];
                      const SvgComponent = iconId
                        ? svgComponents[iconId]
                        : null;

                      if (!SvgComponent) return null;

                      return <SvgComponent width={32} height={32} />;
                    })()}
                  </div>
                ) : (
                  <p className="h-8 text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-6 flex items-center justify-center">
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
            <div className="flex flex-col items-center justify-center py-12 mt-20">
              <p className="text-md text-black mb-5">
                아직 기록된 감정이 없어요
              </p>
            </div>
          ) : (
            // ) : emotionData?.content?.length === 1 ? (
            //   /* 1개 있을 때 상태 */
            //   <div className="space-y-4">
            //     {/* Single Emotion Card */}
            //     <div className="grid grid-cols-1 gap-1">
            //       {emotionCards?.map(card => (
            //         <button
            //           key={card.id}
            //           onClick={() => handleCardClick(card.id)}
            //           className="relative aspect-square border group hover:opacity-80 transition-opacity"
            //         >
            //           {/* SVG 컴포넌트를 위에 렌더링 */}
            //           <div className="absolute z-10 flex items-center justify-center w-full h-full">
            //             {(() => {
            //               // emotionIconsByStep에서 해당 감정과 단계에 맞는 아이콘 ID 찾기
            //               const iconId =
            //                 emotionIconsByStep[
            //                   card.emotions[0]
            //                     .type as keyof typeof emotionIconsByStep
            //                 ]?.[card.emotions[0].step - 1];

            //               if (!iconId) return null;

            //               // 아이콘 ID를 파일명으로 변환 (예: Yellow1 -> Yellow, Pink2 -> Pink)
            //               const fileName = iconId.replace(/\d+$/, '');

            //               // faceSvgComponents에서 해당 파일명의 컴포넌트 찾기
            //               const SvgComponent = faceSvgComponents[fileName];

            //               if (!SvgComponent) return null;

            //               return <SvgComponent width={32} height={32} />;
            //             })()}
            //           </div>

            //           {/* <div
            //             className="absolute inset-0"
            //             style={{ backgroundColor: getCardBackgroundColor(card) }}
            //           /> */}
            //         </button>
            //       ))}

            //       {/* Add New Button */}
            //       <Link
            //         href="/emotion/select"
            //         className="aspect-square bg-gray-300 border flex items-center justify-center hover:bg-gray-400 transition-colors"
            //         prefetch={true}
            //       >
            //         <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            //           <span className="text-lg text-white">+</span>
            //         </div>
            //       </Link>
            //     </div>
            //   </div>
            // ) : (
            /* 여러 개 있을 때 상태 */
            <div className="space-y-4">
              {/* Emotion Cards Grid */}
              <div ref={gridRef} className="grid grid-cols-3 w-full">
                {emotionCards?.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="relative aspect-square group hover:opacity-80 transition-opacity"
                  >
                    {/* SVG 컴포넌트를 위에 렌더링 */}
                    <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full">
                      {card.emotions[0] &&
                        (() => {
                          const iconId =
                            emotionIconsByStep[
                              card.emotions[0]
                                .type as keyof typeof emotionIconsByStep
                            ]?.[card.emotions[0].step - 1];

                          if (!iconId) return null;

                          // 아이콘 ID를 파일명으로 변환 (예: Yellow1 -> Yellow, Pink2 -> Pink)
                          const fileName = iconId.replace(/\d+$/, '');

                          // svgComponents에서 해당 파일명의 컴포넌트 찾기
                          const FaceSvgComponent = faceSvgComponents[fileName];

                          if (!FaceSvgComponent) return null;

                          return (
                            <FaceSvgComponent
                              width={svgSize}
                              height={svgSize}
                            />
                          );
                        })()}
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: getCardBackgroundColor(card) }}
                    />

                    {card.hasAudioFile && (
                      <div className="absolute bottom-0 right-0 w-[24px] h-[17px]">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute top-0 right-0 w-[24px] h-[17px] bg-[#000000] opacity-20 flex items-center justify-center"></div>
                          <div className="absolute top-0 right-0 w-[24px] h-[17px] opacity-100 flex items-center justify-center">
                            <PlayingIcon width={14} height={9} color="white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
