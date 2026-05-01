/**
 * DS-9: Image utilities for blur placeholder generation.
 * Use generateBlurPlaceholder() in server components to create
 * blurDataURL for Next.js <Image> placeholder="blur".
 */

/**
 * Generate a tiny SVG-based blur placeholder from a color.
 * Lightweight alternative to full blurhash when source image is unavailable.
 */
export function generateColorBlur(
  color: string = "#E2E8F0",
  width = 8,
  height = 8
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <filter id="b" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="1"/>
    </filter>
    <rect width="100%" height="100%" fill="${color}" filter="url(#b)"/>
  </svg>`;
  const base64 = typeof Buffer !== "undefined"
    ? Buffer.from(svg).toString("base64")
    : btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Predefined blur placeholders for common content types.
 */
export const BLUR_PRESETS = {
  /** Warm neutral — for expert profile photos */
  profile: generateColorBlur("#D1C4B4"),
  /** Cool neutral — for article hero images */
  article: generateColorBlur("#CBD5E1"),
  /** Warm accent — for challenge thumbnails */
  challenge: generateColorBlur("#FDE68A"),
  /** Default fallback */
  default: generateColorBlur("#E2E8F0"),
} as const;
