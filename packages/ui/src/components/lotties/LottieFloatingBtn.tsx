'use client';

import dynamic from 'next/dynamic';
import lottieOnboardCharacters from './FloatingBtnLottie.json';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottieFloatingBtnProps {
  width?: number;
  height?: number;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  rendererSettings?: any;
  style?: React.CSSProperties;
}

export default function LottieOnboardCharacters({
  width,
  height,
  className,
  loop = true,
  autoplay = true,
  rendererSettings,
  style,
  ...props
}: LottieFloatingBtnProps) {
  return (
    <Lottie
      animationData={lottieOnboardCharacters}
      style={{ width: width, height: height, ...style }}
      className={className}
      loop={loop}
      autoplay={autoplay}
      rendererSettings={rendererSettings}
      {...props}
    />
  );
}
