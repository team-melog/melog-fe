import React from 'react';

interface CheckDefaultIconProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export default function CheckDefaultIcon({
  className = '',
  width = 20,
  height = 20,
  color = 'currentColor',
}: CheckDefaultIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M18.581 6.08096C19.0886 5.57327 19.9112 5.57327 20.4188 6.08096C20.9265 6.58864 20.9265 7.41117 20.4188 7.91885L10.9188 17.4188C10.4112 17.9265 9.58864 17.9265 9.08096 17.4188L4.08096 12.4188C3.57327 11.9112 3.57327 11.0886 4.08096 10.581C4.58864 10.0733 5.41117 10.0733 5.91885 10.581L9.9999 14.662L18.581 6.08096Z"
        fill={color}
      />
    </svg>
  );
}
