import React from 'react';

interface PlayIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function PlayIcon({
  width,
  height,
  color = 'currentColor',
}: PlayIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 9.63397C18.1667 10.0189 18.1667 10.9811 17.5 11.366L7 17.4282C6.33333 17.8131 5.5 17.332 5.5 16.5622L5.5 4.43782C5.5 3.66802 6.33333 3.1869 7 3.5718L17.5 9.63397Z"
        fill={color}
      />
    </svg>
  );
}
