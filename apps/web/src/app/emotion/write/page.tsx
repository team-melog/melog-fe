'use client';

import { Layout, LeftIcon } from '@melog/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useEmotionStore } from '@/features/store';
import SuspenseWrapper from '@/components/SuspenseWrapper';

function EmotionWriteContent() {
  const router = useRouter();
  const { setTextarea, setRecordedAudio } = useEmotionStore();
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const searchParams = useSearchParams();
  const selectedEmotion = searchParams.get('emotion');
  const selectedIntensity = searchParams.get('intensity');
  const selectedColor = searchParams.get('color');

  // 키보드 표시 여부 감지
  useEffect(() => {
    const handleResize = () => {
      // 화면 높이가 줄어들면 키보드가 올라온 것으로 간주
      // const isVisible = window.innerHeight < window.outerHeight * 0.8;
      // setIsKeyboardVisible(isVisible);
      // if (isVisible) {
      //   // 키보드 높이 계산 (대략적인 값)
      //   const heightDiff = window.outerHeight - window.innerHeight;
      //   setKeyboardHeight(Math.max(heightDiff, 250)); // 최소 250px
      // } else {
      //   setKeyboardHeight(0);
      // }
    };

    const handleFocus = () => {
      // 포커스 시 키보드가 올라올 것으로 예상
      // setTimeout(() => {
      //   const isVisible = window.innerHeight < window.outerHeight * 0.8;
      //   setIsKeyboardVisible(isVisible);
      //   if (isVisible) {
      //     const heightDiff = window.outerHeight - window.innerHeight;
      //     setKeyboardHeight(Math.max(heightDiff, 250));
      //   }
      // }, 300);
    };

    const handleBlur = () => {
      // 블러 시 키보드가 내려갈 것으로 예상
      // setTimeout(() => {
      //   const isVisible = window.innerHeight < window.outerHeight * 0.8;
      //   setIsKeyboardVisible(isVisible);
      //   if (!isVisible) {
      //     setKeyboardHeight(0);
      //   }
      // }, 300);
    };

    window.addEventListener('resize', handleResize);

    if (textareaRef.current) {
      textareaRef.current.addEventListener('focus', handleFocus);
      textareaRef.current.addEventListener('blur', handleBlur);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (textareaRef.current) {
        textareaRef.current.removeEventListener('focus', handleFocus);
        textareaRef.current.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    // 텍스트가 있을 때 에러 메시지 숨기기
    if (newText.trim().length > 0) {
      setErrorMessage('');
    }

    // 특수문자만 있는지 확인 (한글, 영어, 숫자, 공백이 하나도 없는지)
    const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(newText);
    const hasEnglish = /[a-zA-Z]/.test(newText);
    const hasNumber = /[0-9]/.test(newText);
    const hasSpace = /\s/.test(newText);

    const hasValidChar = hasKorean || hasEnglish || hasNumber || hasSpace;

    // 유효한 문자가 없고 특수문자만 있으면 에러 메시지 표시
    if (!hasValidChar && newText.trim().length > 0) {
      setErrorMessage('특수문자만 입력할 수 없어요');
    } else {
      setErrorMessage('');
    }
  };

  const handleSave = () => {
    if (isTextValid) {
      // 텍스트를 전역 상태에 저장 / 오디오 리셋
      setRecordedAudio(null);
      setTextarea(text);

      // 감정 분석 화면으로 이동
      if (selectedEmotion) {
        const params = new URLSearchParams({
          emotion: selectedEmotion,
          intensity: selectedIntensity || '',
          color: selectedColor || '',
        });
        return router.push(`/emotion/analysis?${params.toString()}`);
      }
      return router.push(`/emotion/analysis`);
    } else {
      // 텍스트가 없으면 에러 메시지 표시
      setErrorMessage('텍스트를 입력해주세요');
    }
  };

  const handleBack = () => {
    router.back();
  };

  // 텍스트 유효성 검사: 빈 텍스트가 아니고, 특수문자만으로 구성되지 않았는지 확인
  const isTextValid = (() => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return false;

    // 특수문자만 있는지 확인 (한글, 영어, 숫자, 공백이 하나도 없는지)
    // 한글, 영어, 숫자, 공백 중 하나라도 있으면 유효
    const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(trimmedText);
    const hasEnglish = /[a-zA-Z]/.test(trimmedText);
    const hasNumber = /[0-9]/.test(trimmedText);
    const hasSpace = /\s/.test(trimmedText);

    const hasValidChar = hasKorean || hasEnglish || hasNumber || hasSpace;

    return hasValidChar;
  })();

  return (
    <Layout showTabBar={false}>
      <div className="font-meetme bg-white flex flex-col min-h-svh">
        {/* Header */}
        <div className="flex items-center py-3 px-4">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center"
          >
            <LeftIcon />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Text Input Area */}
          <div className="flex-1 flex flex-col px-4">
            {/* Text Input Container */}
            <div className="flex-1 bg-white border border-[#ecedef] rounded-lg p-4 pr-1 mb-4 flex flex-col">
              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                placeholder="오늘 기억에 남는 이야기를 들려주세요"
                className="flex-1 w-full bg-transparent border-none outline-none resize-none text-black text-lg font-normal leading-relaxed overflow-y-scroll"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  overflow: 'auto',
                }}
              />
            </div>

            {errorMessage && (
              <div className="text-[#ff3d3d] text-lg font-normal tracking-[-0.18px] leading-[21.6px] mb-4">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={!isTextValid}
              className={`w-full py-3 font-normal text-xl tracking-[-0.2px] transition-colors ${
                isTextValid
                  ? 'bg-[#060607] text-white'
                  : 'bg-[#b5b8c0] text-white cursor-not-allowed'
              }`}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function EmotionWritePage() {
  return (
    <SuspenseWrapper>
      <EmotionWriteContent />
    </SuspenseWrapper>
  );
}
