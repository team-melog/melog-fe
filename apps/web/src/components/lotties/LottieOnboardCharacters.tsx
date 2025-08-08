'use client';

import dynamic from 'next/dynamic';
import lottieOnboardCharacters from '../../../public/lottie/OnboardCharacters.json';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function LottieOnboardCharacters() {
  return <Lottie animationData={lottieOnboardCharacters} />;
}
