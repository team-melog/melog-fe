import React from 'react';

interface CheckIconProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export default function CheckIcon({
  className = '',
  width = 20,
  height = 20,
}: CheckIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10Z"
        fill="#060607"
      />
      <path
        d="M14.0123 6.40948C14.3974 5.93904 15.0996 5.86271 15.581 6.23903C16.0624 6.61538 16.1405 7.30157 15.7554 7.77203L10.1739 14.5901C9.98422 14.8219 9.70617 14.9685 9.40375 14.9955C9.10143 15.0224 8.80088 14.9277 8.57143 14.7334L4.38533 11.188C3.9195 10.7935 3.8689 10.1044 4.2725 9.64914C4.67622 9.19391 5.3813 9.14447 5.84719 9.53888L9.15575 12.3412L14.0123 6.40948Z"
        fill="#2CFFA9"
      />
    </svg>
  );
}
