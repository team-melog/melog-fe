'use client';

import dynamic from 'next/dynamic';
import lottieRecordLoading from '../../../public/lottie/RecordLoading.json';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function LottieRecordLoading() {
  return <Lottie animationData={lottieRecordLoading} />;
}
