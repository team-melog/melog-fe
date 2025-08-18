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
      viewBox="0 0 104 124"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M103.37 53.5599C109.09 56.8599 109.09 65.1299 103.37 68.4299L13.22 120.48C7.5 123.78 0.339996 119.65 0.339996 113.05V8.95994C0.339996 2.34994 7.49 -1.78006 13.22 1.51994L103.37 53.57V53.5599Z"
        fill={color}
      />
    </svg>
  );
}
