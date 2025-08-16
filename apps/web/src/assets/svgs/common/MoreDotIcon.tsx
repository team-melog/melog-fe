import React from 'react';

interface MoreDotIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function MoreDotIcon({ width, height }: MoreDotIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1291_10366)">
        <path
          d="M20 12.3333C20 11.6 19.4 11 18.6667 11C17.9333 11 17.3333 11.6 17.3333 12.3333C17.3333 13.0667 17.9333 13.6667 18.6667 13.6667C19.4 13.6667 20 13.0667 20 12.3333ZM6.66667 12.3333C6.66667 11.6 6.06667 11 5.33333 11C4.6 11 4 11.6 4 12.3333C4 13.0667 4.6 13.6667 5.33333 13.6667C6.06667 13.6667 6.66667 13.0667 6.66667 12.3333ZM13.3333 12.3333C13.3333 11.6 12.7333 11 12 11C11.2667 11 10.6667 11.6 10.6667 12.3333C10.6667 13.0667 11.2667 13.6667 12 13.6667C12.7333 13.6667 13.3333 13.0667 13.3333 12.3333Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_1291_10366">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
