// Displacement map: red ramps horizontally, green ramps vertically, both neutral
// (0x80) across the middle so only the outer edges refract, like a lens rim.
const MAP_X =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset="0.22" stop-color="#808080"/><stop offset="0.78" stop-color="#808080"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/></svg>`
  );

const MAP_Y =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="0.3" stop-color="#808080"/><stop offset="0.7" stop-color="#808080"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/></svg>`
  );

export function LiquidGlassFilter() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
      <filter id="liquid-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={MAP_X} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="mapX" />
        <feImage href={MAP_Y} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="mapY" />
        <feColorMatrix
          in="mapX"
          type="matrix"
          values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1"
          result="red"
        />
        <feColorMatrix
          in="mapY"
          type="matrix"
          values="0 0 0 0 0  1 0 0 0 0  0 0 0 0 0  0 0 0 0 1"
          result="green"
        />
        <feComposite in="red" in2="green" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="48" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
