import React from 'react';

interface MicrophoneIconProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export default function MicrophoneIcon({
  className = '',
  width = 44,
  height = 46,
  color = 'currentColor',
}: MicrophoneIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 44 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="13.4592"
        y="0.775513"
        width="17"
        height="27.625"
        rx="8"
        fill={color}
        stroke={color}
        stroke-width="1.5"
      />
      <path
        d="M38.9592 20.963C38.9592 30.3519 31.3481 37.963 21.9592 37.963C12.5704 37.963 4.95923 30.3519 4.95923 20.963"
        stroke={color}
        stroke-width="5"
        stroke-linecap="round"
      />
      <path
        d="M21.9592 43.2755V39.0255"
        stroke={color}
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
  );
}
