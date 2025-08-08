'use client';

import dynamic from 'next/dynamic';
import lottieSelectCharacters from '../../../public/lottie/SelectCharacters.json';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function LottieSelectCharacters() {
  return <Lottie animationData={lottieSelectCharacters} />;
}
