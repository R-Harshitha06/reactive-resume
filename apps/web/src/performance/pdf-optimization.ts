/**
 * PDF Generation Performance Optimizations
 * Reduces rendering time and memory usage for PDF exports
 */

// Font cache to avoid redundant registrations
const fontCache = new Map<string, Promise<ArrayBuffer>>();

/**
 * Cached font loader
 * Prevents loading the same font multiple times
 */
export const getCachedFont = async (
  fontName: string,
  fontUrl: string
): Promise<ArrayBuffer> => {
  const cacheKey = `${fontName}:${fontUrl}`;
  
  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }
  
  const fontPromise = fetch(fontUrl)
    .then(response => response.arrayBuffer())
    .catch(error => {
      console.error(`Failed to load font ${fontName}:`, error);
      throw error;
    });
  
  fontCache.set(cacheKey, fontPromise);
  return fontPromise;
};

/**
 * Clear font cache to free memory
 */
export const clearFontCache = () => {
  fontCache.clear();
};

/**
 * Memoized PDF document generation
 * Prevents regenerating PDF when data hasn't changed
 */
const pdfCache = new Map<string, Blob>();

/**
 * Get or generate PDF with caching
 */
export const getCachedPDF = (
  resumeId: string,
  generatePDF: () => Promise<Blob>,
  invalidateCache: boolean = false
): Promise<Blob> => {
  if (invalidateCache) {
    pdfCache.delete(resumeId);
  }
  
  if (pdfCache.has(resumeId)) {
    return Promise.resolve(pdfCache.get(resumeId)!);
  }
  
  return generatePDF().then(blob => {
    pdfCache.set(resumeId, blob);
    return blob;
  });
};

/**
 * Clear PDF cache
 */
export const clearPDFCache = () => {
  pdfCache.clear();
};

/**
 * Debounce PDF regeneration to avoid excessive processing
 */
export const debouncePDFGeneration = (
  callback: () => Promise<void>,
  delay: number = 1000
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return async () => {
    if (timeoutId) clearTimeout(timeoutId);
    
    return new Promise<void>(resolve => {
      timeoutId = setTimeout(async () => {
        await callback();
        resolve();
      }, delay);
    });
  };
};
