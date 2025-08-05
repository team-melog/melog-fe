import React from 'react';

interface HomeIconProps {
  className?: string;
  isActive?: boolean;
}

export default function HomeIcon({
  className = '',
  isActive = false,
}: HomeIconProps) {
  const color = isActive ? '#13273A' : '#CCD3DA';

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.166 5.78084C13.1218 3.91392 16.2079 3.93969 18.1318 5.83944L23.5127 11.1529C24.464 12.0923 24.9999 13.3736 25 14.7105V23.9488C25 25.0534 24.1046 25.9488 23 25.9488H19.4404C18.3359 25.9488 17.4404 25.0534 17.4404 23.9488V22.0191C17.4404 20.9146 16.545 20.0191 15.4404 20.0191H13.5596C12.455 20.0191 11.5596 20.9146 11.5596 22.0191V23.9488C11.5596 25.0534 10.6641 25.9488 9.55957 25.9488H6C4.89543 25.9488 4 25.0534 4 23.9488V14.7603C4.00009 13.394 4.55953 12.0875 5.54785 11.1441L11.166 5.78084Z"
        fill={color}
      />
    </svg>
  );
}
