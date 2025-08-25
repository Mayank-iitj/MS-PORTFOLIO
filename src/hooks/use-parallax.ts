"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

export interface ParallaxBoundaries {
  min?: number;
  max?: number;
}

export interface ResponsiveParallaxSpeed {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

export interface ParallaxLayer {
  id: string;
  speed: number | ResponsiveParallaxSpeed;
  zIndex?: number;
  boundaries?: ParallaxBoundaries;
}

export interface ParallaxOptions {
  speed?: number | ResponsiveParallaxSpeed;
  direction?: 'vertical' | 'horizontal' | 'both';
  offset?: number;
  rootMargin?: string;
  disabled?: boolean;
  easing?: (t: number) => number;
  boundaries?: ParallaxBoundaries;
  layers?: ParallaxLayer[];
  throttle?: number;
  useCSSCustomProperties?: boolean;
}

export interface ParallaxReturn<T = HTMLElement> {
  ref: React.RefObject<T>;
  transform: string;
  progress: number;
  offset: number;
  isActive: boolean;
  layers?: Record<string, { transform: string; offset: number }>;
}

const defaultEasing = (t: number): number => t;

const clamp = (value: number, min: number, max: number): number => 
  Math.min(Math.max(value, min), max);

const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

const getBreakpointSpeed = (
  speed: number | ResponsiveParallaxSpeed
): number => {
  if (typeof speed === 'number') return speed;
  
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  if (width < 768) return speed.mobile ?? speed.desktop ?? 0.5;
  if (width < 1024) return speed.tablet ?? speed.desktop ?? 0.5;
  return speed.desktop ?? 0.5;
};

export const useParallax = <T extends HTMLElement = HTMLElement>(
  options: ParallaxOptions = {}
): ParallaxReturn<T> => {
  const {
    speed = 0.5,
    direction = 'vertical',
    offset = 0,
    rootMargin = '0px',
    disabled = false,
    easing = defaultEasing,
    boundaries,
    layers = [],
    throttle: throttleDelay = 16,
    useCSSCustomProperties = false,
  } = options;

  const ref = useRef<T>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [elementTop, setElementTop] = useState(0);
  const [elementLeft, setElementLeft] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);
  const [elementWidth, setElementWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const rafRef = useRef<number>();
  const observerRef = useRef<IntersectionObserver>();

  // Calculate progress and offset values
  const progress = Math.max(0, Math.min(1, 
    direction === 'horizontal' 
      ? (scrollX - elementLeft + windowWidth) / (elementWidth + windowWidth)
      : (scrollY - elementTop + windowHeight) / (elementHeight + windowHeight)
  ));

  const calculateOffset = useCallback((parallaxSpeed: number): number => {
    if (!isInView || disabled) return 0;

    let rawOffset = 0;
    
    if (direction === 'vertical' || direction === 'both') {
      const centerY = elementTop + elementHeight / 2;
      const windowCenterY = scrollY + windowHeight / 2;
      rawOffset += (windowCenterY - centerY) * parallaxSpeed;
    }
    
    if (direction === 'horizontal' || direction === 'both') {
      const centerX = elementLeft + elementWidth / 2;
      const windowCenterX = scrollX + windowWidth / 2;
      rawOffset += (windowCenterX - centerX) * parallaxSpeed;
    }

    const easedOffset = easing(Math.abs(rawOffset / 100)) * Math.sign(rawOffset) * 100;
    let finalOffset = easedOffset + offset;

    if (boundaries) {
      finalOffset = clamp(
        finalOffset,
        boundaries.min ?? -Infinity,
        boundaries.max ?? Infinity
      );
    }

    return finalOffset;
  }, [
    isInView,
    disabled,
    direction,
    elementTop,
    elementHeight,
    elementLeft,
    elementWidth,
    scrollY,
    scrollX,
    windowHeight,
    windowWidth,
    easing,
    offset,
    boundaries
  ]);

  const currentSpeed = getBreakpointSpeed(speed);
  const currentOffset = calculateOffset(currentSpeed);

  // Generate transform string
  const transform = useMemo(() => {
    if (!isActive) return 'translate3d(0, 0, 0)';
    
    if (direction === 'vertical') {
      return `translate3d(0, ${currentOffset}px, 0)`;
    } else if (direction === 'horizontal') {
      return `translate3d(${currentOffset}px, 0, 0)`;
    } else {
      return `translate3d(${currentOffset}px, ${currentOffset}px, 0)`;
    }
  }, [isActive, direction, currentOffset]);

  // Calculate layer transforms
  const layerTransforms = useMemo(() => {
    if (!layers.length) return undefined;
    
    const result: Record<string, { transform: string; offset: number }> = {};
    
    layers.forEach(layer => {
      const layerSpeed = getBreakpointSpeed(layer.speed);
      const layerOffset = calculateOffset(layerSpeed);
      
      let finalLayerOffset = layerOffset;
      if (layer.boundaries) {
        finalLayerOffset = clamp(
          layerOffset,
          layer.boundaries.min ?? -Infinity,
          layer.boundaries.max ?? Infinity
        );
      }
      
      let layerTransform = 'translate3d(0, 0, 0)';
      if (isActive) {
        if (direction === 'vertical') {
          layerTransform = `translate3d(0, ${finalLayerOffset}px, 0)`;
        } else if (direction === 'horizontal') {
          layerTransform = `translate3d(${finalLayerOffset}px, 0, 0)`;
        } else {
          layerTransform = `translate3d(${finalLayerOffset}px, ${finalLayerOffset}px, 0)`;
        }
      }
      
      result[layer.id] = {
        transform: layerTransform,
        offset: finalLayerOffset
      };
    });
    
    return result;
  }, [layers, calculateOffset, isActive, direction]);

  // Update element position and dimensions
  const updateElementBounds = useCallback(() => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    setElementTop(rect.top + window.scrollY);
    setElementLeft(rect.left + window.scrollX);
    setElementHeight(rect.height);
    setElementWidth(rect.width);
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
  }, []);

  // Throttled scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        setScrollX(window.scrollX);
      });
    }, throttleDelay),
    [throttleDelay]
  );

  // Setup intersection observer
  useEffect(() => {
    if (!ref.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        setIsActive(entry.isIntersecting && !disabled);
      },
      {
        rootMargin,
        threshold: 0
      }
    );

    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [rootMargin, disabled]);

  // Setup scroll listeners and resize handlers
  useEffect(() => {
    updateElementBounds();
    
    const handleResize = throttle(updateElementBounds, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial scroll position
    setScrollY(window.scrollY);
    setScrollX(window.scrollX);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, updateElementBounds]);

  // Apply CSS custom properties if enabled
  useEffect(() => {
    if (!useCSSCustomProperties || !ref.current) return;
    
    const element = ref.current as HTMLElement;
    element.style.setProperty('--parallax-offset', `${currentOffset}px`);
    element.style.setProperty('--parallax-progress', progress.toString());
    
    if (layerTransforms) {
      Object.entries(layerTransforms).forEach(([layerId, { offset }]) => {
        element.style.setProperty(`--parallax-${layerId}-offset`, `${offset}px`);
      });
    }
  }, [useCSSCustomProperties, currentOffset, progress, layerTransforms]);

  // Apply will-change optimization
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current as HTMLElement;
    if (isActive) {
      element.style.willChange = 'transform';
    } else {
      element.style.willChange = 'auto';
    }
    
    return () => {
      if (element) {
        element.style.willChange = 'auto';
      }
    };
  }, [isActive]);

  return {
    ref,
    transform,
    progress,
    offset: currentOffset,
    isActive,
    layers: layerTransforms
  };
};

// Multi-layer parallax hook
export const useMultiLayerParallax = <T extends HTMLElement = HTMLElement>(
  layers: ParallaxLayer[],
  options: Omit<ParallaxOptions, 'layers'> = {}
): ParallaxReturn<T> => {
  return useParallax<T>({ ...options, layers });
};

// Simplified parallax hook for basic use cases
export const useSimpleParallax = <T extends HTMLElement = HTMLElement>(
  speed: number = 0.5,
  direction: 'vertical' | 'horizontal' = 'vertical'
): ParallaxReturn<T> => {
  return useParallax<T>({ speed, direction });
};