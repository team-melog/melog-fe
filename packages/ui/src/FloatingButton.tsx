'use client';

import { useRouter } from 'next/navigation';
import LottieFloatingBtn from './components/lotties/LottieFloatingBtn';

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
        className={`relative w-14 h-14 mr-4 bg-[#060607] rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#2a2a2a] pointer-events-auto ${
          showBorder ? 'border-2 border-[#2cffa9]' : ''
        } ${className}`}
      >
        <svg
          className="absolute top-0 left-0 z-10"
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="56" height="56" rx="28" fill="#060607" />
          <path
            d="M40 28C40 28.2652 39.8946 28.5196 39.7071 28.7071C39.5196 28.8946 39.2652 29 39 29H29V39C29 39.2652 28.8946 39.5196 28.7071 39.7071C28.5196 39.8946 28.2652 40 28 40C27.7348 40 27.4804 39.8946 27.2929 39.7071C27.1054 39.5196 27 39.2652 27 39V29H17C16.7348 29 16.4804 28.8946 16.2929 28.7071C16.1054 28.5196 16 28.2652 16 28C16 27.7348 16.1054 27.4804 16.2929 27.2929C16.4804 27.1054 16.7348 27 17 27H27V17C27 16.7348 27.1054 16.4804 27.2929 16.2929C27.4804 16.1054 27.7348 16 28 16C28.2652 16 28.5196 16.1054 28.7071 16.2929C28.8946 16.4804 29 16.7348 29 17V27H39C39.2652 27 39.5196 27.1054 39.7071 27.2929C39.8946 27.4804 40 27.7348 40 28Z"
            fill="white"
          />
        </svg>

        <LottieFloatingBtn
          width={70}
          height={70}
          className="absolute -top-[7px] -left-[7px]"
        />
      </button>
    </div>
  );
}
