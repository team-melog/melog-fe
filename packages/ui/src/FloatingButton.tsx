'use client';

import { useRouter } from 'next/navigation';

interface FloatingButtonProps {
  showBorder?: boolean;
  className?: string;
}

export default function FloatingButton({
  showBorder = false,
  className = '',
}: FloatingButtonProps) {
  const router = useRouter();

  const handleEmotionRecord = () => {
    // 감정 기록 화면으로 이동 (색 선택 화면)
    router.push('/emotion/select');
  };

  return (
    <button
      onClick={handleEmotionRecord}
      className={`fixed bottom-[70px] right-4 w-14 h-14 bg-[#060607] rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#2a2a2a] ${
        showBorder ? 'border-2 border-[#2cffa9]' : ''
      } ${className}`}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 8V24M8 16H24"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
