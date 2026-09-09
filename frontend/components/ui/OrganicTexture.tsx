export function OrganicTexture() {
  return (
    <div className="organic-grain-overlay" aria-hidden="true">
      <svg className="organic-grain-svg">
        <filter id="organicGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#organicGrain)" />
      </svg>
    </div>
  );
}
