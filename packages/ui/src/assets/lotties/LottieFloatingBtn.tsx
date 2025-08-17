'use client';

import dynamic from 'next/dynamic';
import lottieOnboardCharacters from './FloatingBtnLottie.json';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottieFloatingBtnProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function LottieOnboardCharacters({
  width,
  height,
  className,
}: LottieFloatingBtnProps) {
  return (
    <Lottie
      animationData={lottieOnboardCharacters}
      style={{ width: width, height: height }}
      className={className}
    />
  );
}
