import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from './utils/Provider';

const pretendard = localFont({
  src: '../../public/static/fonts/PretendardGOVVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});
const meetme = localFont({
  src: '../../public/static/fonts/OwnglyphMeetme.ttf',
  display: 'swap',
  weight: '400',
  variable: '--font-meetme',
});

export const metadata: Metadata = {
  title: 'ME:LOG - 감정 회고 서비스',
  description:
    '음성 또는 텍스트로 하루의 감정을 기록하고 되돌아볼 수 있는 감정 회고 서비스입니다.',
  openGraph: {
    images: '/static/images/Opengraph.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${meetme.variable}`}>
      <head>
        <link
          rel="preload"
          href="/static/fonts/PretendardGOVVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/static/fonts/OwnglyphMeetme.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
