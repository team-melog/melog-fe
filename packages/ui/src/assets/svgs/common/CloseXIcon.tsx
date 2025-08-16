import React from 'react';

interface CloseXIconProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export default function CloseXIcon({
  className = '',
  width = 24,
  height = 24,
  color = 'currentColor',
}: CloseXIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_1291_9106)">
        <path
          d="M17.9102 4.91016C18.4569 4.36347 19.3429 4.36351 19.8896 4.91016C20.4361 5.45691 20.4363 6.34302 19.8896 6.88965L14.3789 12.3994L19.8896 17.9102C20.4361 18.4569 20.4362 19.343 19.8896 19.8896C19.343 20.4363 18.4569 20.4361 17.9102 19.8896L12.3994 14.3789L6.88965 19.8896C6.34302 20.4363 5.45691 20.4361 4.91016 19.8896C4.36353 19.3429 4.36346 18.4569 4.91016 17.9102L10.4199 12.3994L4.91016 6.88965C4.36352 6.34291 4.36346 5.45686 4.91016 4.91016C5.45686 4.36346 6.34291 4.36352 6.88965 4.91016L12.3994 10.4199L17.9102 4.91016Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_1291_9106">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
