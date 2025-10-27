export function NoiseEffect() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 opacity-[8%]"
      height="100%"
      width="100%"
    >
      <filter id="noise">
        <feTurbulence
          baseFrequency="0.70"
          numOctaves="4"
          stitchTiles="stitch"
          type="fractalNoise"
        ></feTurbulence>
      </filter>
      <rect filter="url(#noise)" height="100%" width="100%"></rect>
    </svg>
  );
}
