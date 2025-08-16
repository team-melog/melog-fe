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
    <div className="min-w-full sm:min-w-[360px] left-1/2 transform -translate-x-1/2 fixed bottom-[70px] flex justify-end pointer-events-none">
      <button
        onClick={handleEmotionRecord}
        className={`w-14 h-14 mr-4 bg-[#060607] rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#2a2a2a] pointer-events-auto ${
          showBorder ? 'border-2 border-[#2cffa9]' : ''
        } ${className}`}
      >
        {/* //m:left-1/2 sm:transform sm:-translate-x-1/2 */}
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
    </div>
  );
}
