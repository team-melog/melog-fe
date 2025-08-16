import React from 'react';

interface ArrowDownIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function ArrowDownIcon({
  width,
  height,
  color = 'currentColor',
}: ArrowDownIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1348_3763)">
        <path
          d="M9.83317 4.5913C10.0248 4.73505 10.0559 4.99754 9.90261 5.17722L6.34721 9.34376C6.26287 9.44259 6.13501 9.5 6 9.5C5.86499 9.5 5.73713 9.44259 5.65279 9.34376L2.09739 5.17722C1.94406 4.99754 1.97517 4.73505 2.16683 4.5913C2.3585 4.44756 2.63847 4.47672 2.79181 4.65641L6 8.41605L9.20819 4.65641C9.36153 4.47672 9.6415 4.44756 9.83317 4.5913Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_1348_3763">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="matrix(0 1 -1 0 12 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
