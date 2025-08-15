'use client';

import dynamic from 'next/dynamic';
import { Layout } from '@melog/ui';

// SSR을 비활성화한 동적 컴포넌트 로드
const DynamicEmotionRecordContent = dynamic(
  () => import('./components/EmotionRecordContent'),
  {
    ssr: false,
    loading: () => (
      <Layout showTabBar={false}>
        <div className="min-h-svh bg-[#111416] flex flex-col items-center justify-center">
          <div className="text-white">로딩 중...</div>
        </div>
      </Layout>
    ),
  }
);

export default function EmotionRecordPage() {
  return <DynamicEmotionRecordContent />;
}
