import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Test comment for git hook testing - final test

const pretendard = localFont({
  src: '../../public/static/fonts/PretendardGOVVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'ME:LOG - 감정 기록 서비스',
  description:
    '사진과 음성을 활용해 하루 1분 만에 감정을 기록하고 AI 분석 결과를 즉시 확인할 수 있는 웹 기반 감정 기록 서비스입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" className={`${pretendard.variable}`}>
      <body className={`${pretendard.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
