'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout, LeftIcon, TrashIcon } from '@melog/ui';
import { useAppStore } from '@/features/store';
import {
  emotionColorsByStep,
  emotionIconsByStep,
} from '@/entities/emotion/types';
import {
  useDeleteEmotionDetail,
  useEmotionDetail,
} from '@/features/emotion/hooks/useEmotionApi';
import { svgComponents } from '@/assets/svgs/emotions/EmotionSvg';
import { EmotionDetailResponse } from '@/features/emotion/api/types';

export default function FeedDetailPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const params = useParams();
  const emotionId = params.id as string;

  // user.name이 있을 때만 API 호출
  const { data: emotionDetail, isLoading } = useEmotionDetail(
    user.name,
    emotionId
  );

  const { mutate: deleteEmotion } = useDeleteEmotionDetail();

  // 상태 변화 추적
  useEffect(() => {
    if (isLoading) return;
    console.log('emotionDetail', emotionDetail);
  }, [isLoading, emotionDetail]);

  // 가장 높은 percentage를 가진 감정을 메인 감정으로 선택
  const mainEmotion =
    (emotionDetail as unknown as EmotionDetailResponse) &&
    (emotionDetail as unknown as EmotionDetailResponse)?.emotions &&
    (emotionDetail as unknown as EmotionDetailResponse)?.emotions.reduce(
      (prev, current) => (prev.percentage > current.percentage ? prev : current)
    );

  const date = (emotionDetail as unknown as EmotionDetailResponse)?.date;
  const formattedDate =
    date &&
    new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
    }).format(new Date(date));

  // AI 감정 분석 결과 (emotionDetail의 emotions 사용)
  const emotionResults =
    (emotionDetail as unknown as EmotionDetailResponse) &&
    (emotionDetail as unknown as EmotionDetailResponse)?.emotions.map(
      emotion => {
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
      }
    );

  const aiSummary = `${user?.name || '사용자'}님의 감정 분석 결과입니다. ${(emotionDetail as unknown as EmotionDetailResponse) && (emotionDetail as unknown as EmotionDetailResponse)?.emotions.map(e => `${e.type}(${e.percentage}%)`).join(', ')}가 감지되었습니다.\n\n${(emotionDetail as unknown as EmotionDetailResponse) && (emotionDetail as unknown as EmotionDetailResponse)?.summary}`;

  const handleDelete = () => {
    deleteEmotion({ nickname: user.name, id: emotionId });
    router.push('/feed');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={true} nickname={user?.name}>
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
                {(emotionDetail as unknown as EmotionDetailResponse)
                  ?.emotions[0] &&
                  (() => {
                    const iconId =
                      emotionIconsByStep[
                        (emotionDetail as unknown as EmotionDetailResponse)
                          ?.emotions[0].type as keyof typeof emotionIconsByStep
                      ]?.[
                        (emotionDetail as unknown as EmotionDetailResponse)
                          ?.emotions[0].step - 1
                      ];
                    const SvgComponent = iconId ? svgComponents[iconId] : null;

                    if (!SvgComponent) return null;

                    return <SvgComponent width={220} height={220} />;
                  })()}
              </div>
            </div>

            {/* AI Emotion Diagnosis Card */}
            <div className="space-y-4">
              <h3 className="text-[26px] font-normal text-[#060607] tracking-[-0.26px] leading-[31.2px]">
                {mainEmotion && mainEmotion.type}색 (AI 감정진단)
              </h3>

              {/* Emotion Tags */}
              <div className="flex flex-wrap gap-2">
                {emotionResults &&
                  emotionResults.map((emotion, index) => (
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
