'use client';

import dynamic from 'next/dynamic';
import lottiePlayLoadingBar from '../../../public/lottie/PlayLoadingBar.json';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function LottiePlayLoadingBar() {
  return <Lottie animationData={lottiePlayLoadingBar} />;
}
