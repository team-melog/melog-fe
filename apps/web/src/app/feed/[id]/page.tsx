'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout, LeftIcon, MuteIcon, TrashIcon } from '@melog/ui';
import { useEmotionStore, useAppStore } from '@melog/shared';
import { EMOTIONS } from '@melog/shared';

export default function FeedDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { entries, deleteEntry } = useEmotionStore();
  const { user } = useAppStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const entryId = params.id as string;
  const entry = entries.find(e => e.id === entryId);

  if (!entry) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-500">감정 기록을 찾을 수 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            뒤로 가기
          </button>
        </div>
      </Layout>
    );
  }

  const emotionConfig = EMOTIONS[entry.emotion];
  const date = new Date(entry.timestamp);
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
  }).format(date);

  // AI 감정 분석 결과 (더미 데이터)
  const emotionResults = [
    {
      name: '지침',
      percentage: 50,
      color: '#dee1e2',
      borderColor: '#c0c2c4',
      textColor: '#838e96',
    },
    {
      name: '분노',
      percentage: 30,
      color: '#ffb8b8',
      borderColor: '#ff5a5a',
      textColor: '#ed3a3a',
    },
    {
      name: '평온',
      percentage: 20,
      color: '#ccffe4',
      borderColor: '#6bfcc1',
      textColor: '#0cda86',
    },
  ];

  const aiSummary = `오늘 ${user?.name || '사용자'}님의 목소리에는 지침(50%), 분노(30%), 평온(20%)이 섞여 있었습니다. 업무량이 많아 몸과 마음이 무겁지만, 일 자체에는 여전히 흥미를 느끼고 있는 상태예요. 다만 주변 동료와의 관계나 환경에서 오는 스트레스가 피로감을 키우고 있어요.\n\n이런 상황에서는 잠깐의 휴식이나 가벼운 대화로 긴장을 풀어주는 것이 도움이 될 수 있습니다. 당신의 열정은 여전히 살아있으니, 에너지를 회복할 시간을 꼭 챙겨주세요.`;

  const handleDelete = () => {
    deleteEntry(entryId);
    router.push('/feed');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={true}>
      <div className="font-meetme min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          {/* Header */}
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="w-6 h-6 flex items-center justify-center"
            >
              <LeftIcon />
            </button>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <TrashIcon color="#1F2024" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center p-4">
          {/* Result Card */}
          <div className="bg-white border border-[#d0d2d7] rounded-[20px] p-4 w-full max-w-[328px]">
            {/* Date */}
            <div className="mb-6">
              <h2 className="text-[22px] font-normal text-black tracking-[-0.22px] leading-[26.4px]">
                {formattedDate}
              </h2>
            </div>

            {/* Emotion Circle */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="w-[220px] h-[220px] bg-[#b1b6ba] flex items-center justify-center"
                  style={{ backgroundColor: emotionConfig?.color || '#b1b6ba' }}
                ></div>

                {/* Sound Icon Overlay (if voice note exists) */}
                {entry.voiceNote && (
                  <div className="absolute z-10 bottom-4 right-4 w-12 h-12 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                    {entry.voiceNote ? (
                      <MuteIcon color="white" />
                    ) : (
                      <MuteIcon color="#1F2024" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* AI Emotion Diagnosis Card */}
            <div className="space-y-4">
              <h3 className="text-[26px] font-normal text-[#060607] tracking-[-0.26px] leading-[31.2px]">
                지침색 (AI 감정진단)
              </h3>

              {/* Emotion Tags */}
              <div className="flex flex-wrap gap-2">
                {emotionResults.map((emotion, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-xl border text-lg font-normal tracking-[-0.18px] leading-[21.6px]"
                    style={{
                      backgroundColor: emotion.color,
                      borderColor: emotion.borderColor,
                      color: emotion.textColor,
                    }}
                  >
                    {emotion.name} {emotion.percentage}%
                  </span>
                ))}
              </div>

              {/* AI Summary */}
              <div className="bg-white rounded-lg">
                <p className="text-[15px] font-medium text-[#1f2024] leading-6 tracking-[-0.15px] whitespace-pre-line">
                  {aiSummary}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[51]">
            <div className="bg-white rounded-xl p-6 mx-10 max-w-sm w-full">
              <h3 className="text-2xl text-black">삭제하시겠습니까?</h3>
              <p className="text-base text-gray-600 mb-6">
                게시물이 삭제됩니다.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="py-1 px-6 border-[1px] border-[#060607] rounded-3xl text-[#060607] hover:bg-[#060607]/10 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="py-1 px-6 bg-[#060607] text-white rounded-3xl"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
