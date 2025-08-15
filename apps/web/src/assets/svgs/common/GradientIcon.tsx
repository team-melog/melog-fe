import React from 'react';

interface GradientIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function GradientIcon({ width, height }: GradientIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7.5" cy="7" r="7" fill="url(#paint0_linear_1314_3773)" />
      <defs>
        <linearGradient
          id="paint0_linear_1314_3773"
          x1="5.16667"
          y1="-1.16667"
          x2="10.7083"
          y2="12.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#587EFC" />
          <stop offset="0.495192" stopColor="#58C8FC" />
          <stop offset="1" stopColor="#2CFFA9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
