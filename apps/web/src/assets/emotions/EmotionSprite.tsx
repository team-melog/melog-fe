import React from 'react';

interface EmotionSpriteProps {
  emotion: string;
  step: number;
  className?: string;
  size?: number;
}

// SVG 파일들을 React 컴포넌트로 import
import Yellow1 from './Yellow1.svg';
import Yellow2 from './Yellow2.svg';
import Yellow3 from './Yellow3.svg';
import Yellow4 from './Yellow4.svg';
import Yellow5 from './Yellow5.svg';

import Pink1 from './Pink1.svg';
import Pink2 from './Pink2.svg';
import Pink3 from './Pink3.svg';
import Pink4 from './Pink4.svg';
import Pink5 from './Pink5.svg';

import Green1 from './Green1.svg';
import Green2 from './Green2.svg';
import Green3 from './Green3.svg';
import Green4 from './Green4.svg';
import Green5 from './Green5.svg';

import Red1 from './Red1.svg';
import Red2 from './Red2.svg';
import Red3 from './Red3.svg';
import Red4 from './Red4.svg';
import Red5 from './Red5.svg';

import Blue1 from './Blue1.svg';
import Blue2 from './Blue2.svg';
import Blue3 from './Blue3.svg';
import Blue4 from './Blue4.svg';
import Blue5 from './Blue5.svg';

import Grey1 from './Grey1.svg';
import Grey2 from './Grey2.svg';
import Grey3 from './Grey3.svg';
import Grey4 from './Grey4.svg';
import Grey5 from './Grey5.svg';
import { emotionIconsByStep } from '@/entities';

// SVG 컴포넌트들을 객체로 관리
export const svgComponents: {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} = {
  Yellow1,
  Yellow2,
  Yellow3,
  Yellow4,
  Yellow5,
  Pink1,
  Pink2,
  Pink3,
  Pink4,
  Pink5,
  Green1,
  Green2,
  Green3,
  Green4,
  Green5,
  Red1,
  Red2,
  Red3,
  Red4,
  Red5,
  Blue1,
  Blue2,
  Blue3,
  Blue4,
  Blue5,
  Grey1,
  Grey2,
  Grey3,
  Grey4,
  Grey5,
};

export default function EmotionSprite({
  emotion,
  step,
  className = '',
  size,
}: EmotionSpriteProps) {
  const iconId =
    emotionIconsByStep[emotion as keyof typeof emotionIconsByStep]?.[step - 1];
  const SvgComponent = iconId ? svgComponents[iconId] : null;
  if (!SvgComponent) {
    return null;
  }

  return <SvgComponent width={size} height={size} className={className} />;
}
