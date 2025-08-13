'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout, LeftIcon, TrashIcon } from '@melog/ui';
import { useAppStore } from '@melog/shared';
import {
  emotionColorsByStep,
  emotionIconsByStep,
} from '@/entities/emotion/types';
import { useEmotionDetail } from '@/features/emotion/hooks/useEmotionApi';
import { svgComponents } from '@/assets/svgs/EmotionSvg';

const testData = {
  id: 1,
  text: '요즘 너무 지쳐서 술마시고 싶어...',
  summary: '최근 불안과 지침이 반복되는 상태입니다.',
  emotions: [
    { type: '지침', percentage: 40, step: 2 },
    { type: '슬픔', percentage: 30, step: 2 },
    { type: '분노', percentage: 30, step: 2 },
  ],
  userSelectedEmotion: {
    type: '설렘',
    percentage: 30,
  },
};

export default function FeedDetailPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const params = useParams();
  const emotionId = params.id as string;
  const { data: emotionDetail } = useEmotionDetail(user?.name || '', emotionId);
  console.log('emotionDetail', emotionId, emotionDetail);

  // testData를 사용하여 감정 데이터 표시
  // 실제로는 params.id에 따라 다른 데이터를 가져와야 함
  const entry = testData;

  // 가장 높은 percentage를 가진 감정을 메인 감정으로 선택
  const mainEmotion = entry.emotions.reduce((prev, current) =>
    prev.percentage > current.percentage ? prev : current
  );

  // emotionColorsByStep에서 해당 감정과 단계에 맞는 색상 가져오기
  const mainEmotionColor =
    emotionColorsByStep[mainEmotion.type as keyof typeof emotionColorsByStep]?.[
      mainEmotion.step - 1
    ] || '#b1b6ba';

  const date = new Date('2025-08-01'); // testData에 date가 없으므로 임시로 설정
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
  }).format(date);

  // AI 감정 분석 결과 (testData의 emotions 사용)
  const emotionResults = entry.emotions.map(emotion => {
    const colors =
      emotionColorsByStep[emotion.type as keyof typeof emotionColorsByStep];
    const color = colors ? colors[emotion.step - 1] : '#cccccc';

    return {
      name: emotion.type,
      percentage: emotion.percentage,
      color: color,
      borderColor: color,
      textColor: '#1f2024',
    };
  });

  const aiSummary = `${user?.name || '사용자'}님의 감정 분석 결과입니다. ${entry.emotions.map(e => `${e.type}(${e.percentage}%)`).join(', ')}가 감지되었습니다.\n\n${entry.summary}`;

  const handleDelete = () => {
    // testData는 정적 데이터이므로 실제 삭제는 불가능
    // 대신 피드 목록으로 이동
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
              <div className="relative flex items-center justify-center">
                {(() => {
                  const iconId =
                    emotionIconsByStep[
                      entry.emotions[0].type as keyof typeof emotionIconsByStep
                    ]?.[entry.emotions[0].step - 1];
                  const SvgComponent = iconId ? svgComponents[iconId] : null;

                  if (!SvgComponent) return null;

                  return <SvgComponent width={220} height={220} />;
                })()}
              </div>
            </div>

            {/* AI Emotion Diagnosis Card */}
            <div className="space-y-4">
              <h3 className="text-[26px] font-normal text-[#060607] tracking-[-0.26px] leading-[31.2px]">
                {mainEmotion.type}색 (AI 감정진단)
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
