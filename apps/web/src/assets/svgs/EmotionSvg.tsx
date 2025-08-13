import React from 'react';

// SVG 파일들을 React 컴포넌트로 import
import Yellow1 from './Yellow1';
import Yellow2 from './Yellow2';
import Yellow3 from './Yellow3';
import Yellow4 from './Yellow4';
import Yellow5 from './Yellow5';

import Pink1 from './Pink1';
import Pink2 from './Pink2';
import Pink3 from './Pink3';
import Pink4 from './Pink4';
import Pink5 from './Pink5';

import Green1 from './Green1';
import Green2 from './Green2';
import Green3 from './Green3';
import Green4 from './Green4';
import Green5 from './Green5';

import Red1 from './Red1';
import Red2 from './Red2';
import Red3 from './Red3';
import Red4 from './Red4';
import Red5 from './Red5';

import Blue1 from './Blue1';
import Blue2 from './Blue2';
import Blue3 from './Blue3';
import Blue4 from './Blue4';
import Blue5 from './Blue5';

import Grey1 from './Grey1';
import Grey2 from './Grey2';
import Grey3 from './Grey3';
import Grey4 from './Grey4';
import Grey5 from './Grey5';

// SVG 컴포넌트들을 객체로 관리
export const svgComponents: {
  [key: string]: React.ComponentType<{
    width?: number;
    height?: number;
  }>;
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
