'use client';

import { Layout, LeftIcon } from '@melog/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { intensityLabels } from '@melog/shared';
import { useAppStore } from '@melog/shared';
import { useCreateEmotionRecord } from '@/features/emotion';
import { svgComponents } from '@/assets/svgs/EmotionSvg';

function EmotionInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppStore(state => state.user);

  // 감정 기록 생성 훅 사용
  const {
    mutate: createRecord,
    isPending: loading,
    error,
  } = useCreateEmotionRecord();

  // URL 파라미터에서 선택한 감정 정보 가져오기
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = searchParams.get('intensity');

  // 감정과 강도에 따른 아이콘 ID 매핑
  const emotionIcons: { [key: string]: string[] } = {
    기쁨: ['Yellow1', 'Yellow2', 'Yellow3', 'Yellow4', 'Yellow5'],
    설렘: ['Pink1', 'Pink2', 'Pink3', 'Pink4', 'Pink5'],
    평온: ['Green1', 'Green2', 'Green3', 'Green4', 'Green5'],
    분노: ['Red1', 'Red2', 'Red3', 'Red4', 'Red5'],
    슬픔: ['Blue1', 'Blue2', 'Blue3', 'Blue4', 'Blue5'],
    지침: ['Grey1', 'Grey2', 'Grey3', 'Grey4', 'Grey5'],
  };
  const selectedIconId =
    emotionIcons[selectedEmotion || ''][Number(selectedIntensity) - 1];

  const SvgComponent = selectedIconId ? svgComponents[selectedIconId] : null;

  const handleVoiceSelect = async () => {
    try {
      // 감정 기록 생성
      if (selectedEmotion && selectedIntensity) {
        await createRecord({
          nickname: user?.name || '',
          request: {
            emotion: selectedEmotion,
            intensity: Number(selectedIntensity),
            description: '음성 녹음을 통한 감정 기록',
          },
        });
      }
      // 녹음 화면으로 이동
      router.push('/emotion/record');
    } catch (error) {
      console.error('감정 기록 생성 실패:', error);
    }
  };

  const handleTextSelect = async () => {
    try {
      // 감정 기록 생성
      if (selectedEmotion && selectedIntensity) {
        await createRecord({
          nickname: user?.name || '',
          request: {
            emotion: selectedEmotion,
            intensity: Number(selectedIntensity),
            description: '텍스트 입력을 통한 감정 기록',
          },
        });
      }
      // 텍스트 입력 화면으로 이동
      router.push('/emotion/write');
    } catch (error) {
      console.error('감정 기록 생성 실패:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout showTabBar={false}>
      <div className="min-h-svh bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center py-3">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center"
          >
            <LeftIcon />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-between px-4 pt-1">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-meetme text-black leading-tight">
              왜&nbsp;
              {selectedEmotion ? (
                <span>
                  {selectedIntensity &&
                    intensityLabels[Number(selectedIntensity) - 1]}
                  &nbsp;
                  {selectedEmotion}
                </span>
              ) : (
                <div className="w-20 h-[2px] bg-[#060607] ml-2"></div>
              )}
              색을 골랐나요?
              <br />
              {user?.name || '사용자'}님의 이야기를 들려주세요
            </h1>
          </div>

          <div>
            <div className="w-[150px] h-[150px] flex items-center justify-center mb-4">
              {SvgComponent && <SvgComponent width={150} height={150} />}
            </div>

            <div className="text-center text-gray-500 mb-12">
              <p className="text-xl font-meetme leading-tight">
                AI가 이야기를 분석하고
                <br />
                진짜 감정을 찾아줄게요
              </p>
            </div>
          </div>

          <div className="w-full">
            {/* Error Display */}
            {error && (
              <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error.message}
              </div>
            )}

            {/* Selection Options */}
            <div className="w-full space-y-4 mb-4">
              {/* Voice Recording Option */}
              <button
                onClick={handleVoiceSelect}
                disabled={loading}
                className={`w-full py-3 px-8 rounded-3xl transition-colors text-xl font-meetme ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#060607] text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {loading ? '처리 중...' : '음성으로 녹음하기'}
              </button>

              {/* Text Input Option */}
              <button
                onClick={handleTextSelect}
                disabled={loading}
                className={`w-full py-3 px-8 rounded-3xl transition-colors text-xl font-meetme ${
                  loading
                    ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                    : 'border border-[#060607] text-[#060607] hover:bg-[#060607] hover:text-white'
                }`}
              >
                {loading ? '처리 중...' : '텍스트로 기록하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function EmotionInputPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmotionInputContent />
    </Suspense>
  );
}
