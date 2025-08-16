import React from 'react';

interface PlayingIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function PlayingIcon({
  width,
  height,
  color = 'currentColor',
}: PlayingIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="15.3335"
        y="6.38867"
        width="2.66667"
        height="8.88889"
        rx="1.33333"
        fill={color}
      />
      <rect
        x="2"
        y="7.27734"
        width="2.66667"
        height="7.11111"
        rx="1.33333"
        fill={color}
      />
      <rect
        x="6.44434"
        y="5.5"
        width="2.66667"
        height="10.6667"
        rx="1.33333"
        fill={color}
      />
      <rect
        x="10.8887"
        y="5.5"
        width="2.66667"
        height="10.6667"
        rx="1.33333"
        fill={color}
      />
    </svg>
  );
}
