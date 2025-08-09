export default function GlobalSvgSprites() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
      <symbol id="yellow-1" viewBox="0 0 40 40" fill="none">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <rect width="40" height="40" fill="url(#yellow-1-rect)" />
          <defs>
            <pattern
              id="yellow-1-rect"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlinkHref="#yellow-1" transform="scale(0.00111111)" />
            </pattern>
          </defs>
        </svg>
      </symbol>
      <symbol id="search-bar" viewBox="0 0 16 16" fill="none"></symbol>
    </svg>
  );
}
