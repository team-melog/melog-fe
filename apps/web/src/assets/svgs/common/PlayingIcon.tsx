import React from 'react';

interface PlayingIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function PlayingIcon({
  width,
  height,
  color = 'currentColor',
  className,
}: PlayingIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 104 124"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16.15 0.540039C24.64 0.540039 31.52 7.42004 31.52 15.91V108.11C31.52 116.6 24.64 123.48 16.15 123.48C7.66 123.48 0.779999 116.6 0.779999 108.11V15.91C0.779999 7.42004 7.66 0.540039 16.15 0.540039Z"
        fill={color}
      />
      <path
        d="M87.85 0.540039C96.34 0.540039 103.22 7.42004 103.22 15.91V108.11C103.22 116.6 96.34 123.48 87.85 123.48C79.36 123.48 72.48 116.6 72.48 108.11V15.91C72.48 7.42004 79.36 0.540039 87.85 0.540039Z"
        fill={color}
      />
    </svg>
  );
}
