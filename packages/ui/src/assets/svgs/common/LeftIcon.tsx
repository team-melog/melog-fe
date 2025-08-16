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
      <g clipPath="url(#clip0_1376_4032)">
        <path
          d="M15.7812 19.2198C15.8509 19.2895 15.9062 19.3722 15.9439 19.4632C15.9816 19.5543 16.001 19.6519 16.001 19.7504C16.001 19.849 15.9816 19.9465 15.9439 20.0376C15.9062 20.1286 15.8509 20.2114 15.7812 20.281C15.7115 20.3507 15.6288 20.406 15.5378 20.4437C15.4467 20.4814 15.3491 20.5008 15.2506 20.5008C15.152 20.5008 15.0545 20.4814 14.9634 20.4437C14.8724 20.406 14.7896 20.3507 14.72 20.281L7.21996 12.781C7.15023 12.7114 7.09491 12.6287 7.05717 12.5376C7.01943 12.4466 7 12.349 7 12.2504C7 12.1519 7.01943 12.0543 7.05717 11.9632C7.09491 11.8722 7.15023 11.7894 7.21996 11.7198L14.72 4.21979C14.8607 4.07906 15.0516 4 15.2506 4C15.4496 4 15.6405 4.07906 15.7812 4.21979C15.9219 4.36052 16.001 4.55139 16.001 4.75042C16.001 4.94944 15.9219 5.14031 15.7812 5.28104L8.8109 12.2504L15.7812 19.2198Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_1376_4032">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
