/**
 * PDF Rendering Performance Optimizations
 */

import { Document, Page, Font } from '@react-pdf/renderer';

/**
 * Batch font registration to avoid redundant operations
 */
const registeredFonts = new Set<string>();

export const registerFontOnce = (
  fontName: string,
  fontSource: string | { uri: string } | ArrayBuffer,
  fontData?: any
) => {
  const cacheKey = `${fontName}:${typeof fontSource === 'string' ? fontSource : 'buffer'}`;
  
  if (registeredFonts.has(cacheKey)) {
    return;
  }
  
  Font.register({
    family: fontName,
    src: fontSource,
    ...fontData,
  });
  
  registeredFonts.clear();
  registeredFonts.add(cacheKey);
};

/**
 * Lazy load PDF pages to reduce initial rendering time
 */
export const shouldLoadPage = (
  pageNumber: number,
  currentPage: number,
  preloadRange: number = 1
): boolean => {
  const distance = Math.abs(pageNumber - currentPage);
  return distance <= preloadRange;
};

/**
 * Memoized style calculations
 */
const styleCache = new Map<string, any>();

export const getCachedStyle = (
  key: string,
  calculateStyle: () => any
): any => {
  if (styleCache.has(key)) {
    return styleCache.get(key);
  }
  
  const style = calculateStyle();
  styleCache.set(key, style);
  return style;
};

export const clearStyleCache = () => {
  styleCache.clear();
};
