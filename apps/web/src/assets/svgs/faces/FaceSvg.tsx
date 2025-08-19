import React from 'react';

// SVG 파일들을 React 컴포넌트로 import
import Grey from './Grey';
import Pink from './Pink';
import Green from './Green';
import Red from './Red';
import Blue from './Blue';
import Yellow from './Yellow';

// SVG 컴포넌트들을 객체로 관리
export const faceSvgComponents: {
  [key: string]: React.ComponentType<{
    width?: number;
    height?: number;
    color?: string;
  }>;
} = {
  Grey,
  Pink,
  Green,
  Red,
  Blue,
  Yellow,
};
