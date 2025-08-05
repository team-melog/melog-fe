'use client';

import { Layout, Button } from '@melog/ui';
import { useAppStore, useEmotionStore, EMOTIONS } from '@melog/shared';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

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
      color: emotionConfig?.color || '#gray-300',
      hasVoice: !!entry.voiceNote,
    };
  });

  return (
    <Layout showTabBar={true}>
      <div className="min-h-screen bg-white flex flex-col pb-20">
        {/* Header */}
        <div className="px-4 py-6">
          {/* Profile Section */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <h1 className="text-xl font-semibold text-black">
                {user?.name || '닉네임명'}
              </h1>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gray-300 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-sm text-black">감정 기록</p>
                <p className="text-sm font-semibold text-black">
                  {hasData ? entries.length : 12}
                </p>
              </div>
              <div className="w-px h-4 bg-black"></div>
              <div className="text-center">
                <p className="text-sm text-black">대표 감정</p>
                {hasData ? (
                  <div className="flex items-center justify-center mt-1 p-1 bg-white rounded-md">
                    <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-xs text-black">매우 기쁨</span>
                  </div>
                ) : (
                  <p className="text-sm text-black">-</p>
                )}
              </div>
              <div className="w-px h-4 bg-black"></div>
              <div className="text-center">
                <p className="text-sm text-black">음성 녹음</p>
                <p className="text-sm font-semibold text-black">
                  {hasData ? entries.filter(e => e.voiceNote).length : 8}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {!hasData ? (
            /* No Data State */
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-black mb-8">
                아직 기록된 감정이 없어요
              </p>
              <Link href="/emotion/select" prefetch={true}>
                <Button className="bg-gray-400 hover:bg-gray-500 text-black font-semibold py-3 px-8 rounded-lg transition-colors text-xl">
                  감정 기록하기
                </Button>
              </Link>
            </div>
          ) : (
            /* Has Data State */
            <div className="space-y-4">
              {/* Emotion Cards Grid */}
              <div className="grid grid-cols-3 gap-1">
                {emotionCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="aspect-square bg-gray-300 border border-white relative group hover:bg-gray-400 transition-colors"
                  >
                    {/* Voice Indicator */}
                    {card.hasVoice && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-xs">🎤</span>
                      </div>
                    )}

                    {/* Emotion Color Overlay */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ backgroundColor: card.color }}
                    />

                    {/* Date */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs text-black font-medium truncate">
                        {card.date}
                      </p>
                    </div>
                  </button>
                ))}

                {/* Add New Button */}
                <Link
                  href="/emotion/select"
                  className="aspect-square bg-gray-300 border border-white flex items-center justify-center hover:bg-gray-400 transition-colors"
                  prefetch={true}
                >
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-lg">+</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
