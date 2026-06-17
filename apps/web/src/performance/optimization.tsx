/**
 * Performance Optimization Utilities
 * Provides React optimization patterns and memoization helpers
 */

import React, { useMemo, useCallback, memo } from 'react';

/**
 * Memoized component wrapper for frequently rendered items
 * Prevents unnecessary re-renders when props haven't changed
 */
export const withMemoization = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) => memo(Component, propsAreEqual);

/**
 * Hook for memoizing expensive calculations
 */
export const useMemoCallback = <T,>(
  callback: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(callback, deps);
};

/**
 * Hook for stable event handler references
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps) as T;
};

/**
 * Performance monitoring hook
 * Tracks component render times and helps identify performance bottlenecks
 */
export const usePerformanceMonitor = (componentName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16.67) { // Longer than 60fps frame (16.67ms)
        console.warn(
          `[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms`
        );
      }
    };
  }, [componentName]);
};

/**
 * Batch state updates to reduce re-renders
 */
export const batchUpdates = (
  updates: Array<() => void>
) => {
  // Use React's unstable_batchedUpdates if available, otherwise execute sequentially
  const batchedUpdates = (React as any).unstable_batchedUpdates;
  
  if (batchedUpdates) {
    batchedUpdates(() => {
      updates.forEach(update => update());
    });
  } else {
    updates.forEach(update => update());
  }
};
