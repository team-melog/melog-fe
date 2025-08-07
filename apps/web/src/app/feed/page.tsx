'use client';

import { Layout, Button } from '@melog/ui';
import { useAppStore, useEmotionStore, EMOTIONS } from '@melog/shared';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import ProfileIcon from '@/assets/icons/ProfileIcon.svg';

export default function FeedPage() {
  const router = useRouter();
  const user = useAppStore(state => state.user);
  const entries = useEmotionStore(state => state.entries);

  // emotion 관련 페이지들 prefetch
  useEffect(() => {
    router.prefetch('/emotion/select');
    router.prefetch('/emotion/record');
    router.prefetch('/emotion/write');
  }, [router]);

  // 실제 데이터 사용
  const hasData = entries.length > 0;
  const voiceEntries = entries.filter(e => e.voiceNote);
  const dominantEmotion = hasData ? entries[0]?.emotion : null;

  const handleCardClick = (entryId: string) => {
    router.push(`/feed/${entryId}`);
  };

  // 실제 감정 데이터를 카드 형태로 변환
  const emotionCards = entries.map(entry => {
    const date = new Date(entry.timestamp);
    const formattedDate = new Intl.DateTimeFormat('ko-KR', {
      month: '2-digit',
      day: '2-digit',
    }).format(date);

    const emotionConfig = EMOTIONS[entry.emotion];

    return {
      id: entry.id,
      date: formattedDate,
      emotion: emotionConfig?.name || entry.emotion,
      color: emotionConfig?.color || '#ff8f8f',
      hasVoice: !!entry.voiceNote,
    };
  });

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
          <div className="bg-white border border-[#d0d2d7] rounded-2xl p-3 mb-6">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-lg font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px] mb-2">
                  감정기록
                </p>
                <p className="text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-6">
                  {hasData ? entries.length : 0}
                </p>
              </div>
              <div className="w-px h-10 bg-[#d0d2d7]"></div>
              <div className="text-center flex-1">
                <p className="text-lg font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px] mb-2">
                  대표감정
                </p>
                {hasData && dominantEmotion ? (
                  <div className="flex items-center justify-center">
                    <div
                      className="w-8 h-8"
                      style={{
                        backgroundColor:
                          EMOTIONS[dominantEmotion]?.color || '#ff8f8f',
                      }}
                    ></div>
                  </div>
                ) : (
                  <p className="text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-6">
                    -
                  </p>
                )}
              </div>
              <div className="w-px h-10 bg-[#d0d2d7]"></div>
              <div className="text-center flex-1">
                <p className="text-lg font-normal text-[#36393f] tracking-[-0.18px] leading-[21.6px] mb-2">
                  음성녹음
                </p>
                <p className="text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-6">
                  {voiceEntries.length}
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
          ) : entries.length === 1 ? (
            /* 1개 있을 때 상태 */
            <div className="space-y-4">
              {/* Single Emotion Card */}
              <div className="grid grid-cols-1 gap-1">
                {emotionCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="aspect-square bg-gray-300 border border-white relative group hover:bg-gray-400 transition-colors"
                    style={{ backgroundColor: card.color }}
                  >
                    {/* Voice Indicator */}
                    {card.hasVoice && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">🎤</span>
                      </div>
                    )}
                  </button>
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
                    className="aspect-square bg-gray-300 border border-white relative group hover:bg-gray-400 transition-colors"
                    style={{ backgroundColor: card.color }}
                  >
                    {/* Voice Indicator */}
                    {card.hasVoice && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">🎤</span>
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
