import React from 'react';

interface LeftIconProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export default function LeftIcon({
  className = '',
  width = 24,
  height = 24,
  color = 'currentColor',
}: LeftIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15 18L9 12L15 6"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
