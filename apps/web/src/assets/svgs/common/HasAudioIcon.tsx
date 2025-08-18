import React from 'react';

interface HasAudioIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function HasAudioIcon({
  width,
  height,
  color = 'currentColor',
  className,
}: HasAudioIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 14 9`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.6667 1.875C11.6667 1.25368 12.189 0.75 12.8333 0.75C13.4777 0.75 14 1.25368 14 1.875V7.125C14 7.74632 13.4777 8.25 12.8333 8.25C12.189 8.25 11.6667 7.74632 11.6667 7.125V1.875Z"
        fill={color}
      />
      <path
        d="M0 2.625C0 2.00368 0.522335 1.5 1.16667 1.5C1.811 1.5 2.33333 2.00368 2.33333 2.625V6.375C2.33333 6.99632 1.811 7.5 1.16667 7.5C0.522335 7.5 0 6.99632 0 6.375V2.625Z"
        fill={color}
      />
      <path
        d="M3.88889 1.125C3.88889 0.503681 4.41122 0 5.05556 0C5.69989 0 6.22222 0.50368 6.22222 1.125V7.875C6.22222 8.49632 5.69989 9 5.05556 9C4.41122 9 3.88889 8.49632 3.88889 7.875V1.125Z"
        fill={color}
      />
      <path
        d="M7.77778 1.125C7.77778 0.503681 8.30011 0 8.94444 0C9.58878 0 10.1111 0.50368 10.1111 1.125V7.875C10.1111 8.49632 9.58878 9 8.94444 9C8.30011 9 7.77778 8.49632 7.77778 7.875V1.125Z"
        fill={color}
      />
    </svg>
  );
}
