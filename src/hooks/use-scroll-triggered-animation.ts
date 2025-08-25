"use client";

import { useEffect, useRef, useCallback, useState } from 'react';

export type AnimationType = 
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'scaleDown'
  | 'rotateIn'
  | 'flipX'
  | 'flipY';

export interface UseScrollAnimationConfig {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  animationType?: AnimationType;
  staggerDelay?: number;
  staggerChildren?: boolean;
  disabled?: boolean;
}

export interface ScrollAnimationReturn {
  ref: React.RefObject<Element>;
  inView: boolean;
  hasTriggered: boolean;
  progress: number;
}

const defaultConfig: Required<UseScrollAnimationConfig> = {
  threshold: 0.1,
  rootMargin: '0px 0px -10% 0px',
  triggerOnce: true,
  delay: 0,
  duration: 600,
  animationType: 'fadeIn',
  staggerDelay: 100,
  staggerChildren: false,
  disabled: false,
};

export const useScrollAnimation = (
  config: UseScrollAnimationConfig = {}
): ScrollAnimationReturn => {
  const mergedConfig = { ...defaultConfig, ...config };
  const {
    threshold,
    rootMargin,
    triggerOnce,
    delay,
    duration,
    animationType,
    staggerDelay,
    staggerChildren,
    disabled,
  } = mergedConfig;

  const ref = useRef<Element>(null);
  const [inView, setInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [progress, setProgress] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserserverEntry[]) => {
      const [entry] = entries;
      const isIntersecting = entry.isIntersecting;

      // Calculate intersection progress
      const intersectionRatio = entry.intersectionRatio;
      setProgress(intersectionRatio);

      if (isIntersecting) {
        if (!hasTriggered || !triggerOnce) {
          // Apply delay if specified
          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              setInView(true);
              setHasTriggered(true);
            }, delay);
          } else {
            setInView(true);
            setHasTriggered(true);
          }
        }
      } else if (!triggerOnce) {
        // Reset state if not triggerOnce
        setInView(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    },
    [delay, hasTriggered, triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(element);

    // Handle staggered children animations
    if (staggerChildren && inView) {
      const children = element.querySelectorAll('[data-stagger-child]');
      children.forEach((child, index) => {
        const childElement = child as HTMLElement;
        const staggerDelayMs = index * staggerDelay;
        
        setTimeout(() => {
          childElement.style.setProperty('--stagger-delay', `${staggerDelayMs}ms`);
          childElement.classList.add('stagger-animate');
        }, staggerDelayMs);
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    handleIntersect,
    threshold,
    rootMargin,
    disabled,
    inView,
    staggerChildren,
    staggerDelay,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ref,
    inView,
    hasTriggered,
    progress,
  };
};

// Helper function to get animation variants for framer-motion
export const getAnimationVariants = (
  animationType: AnimationType,
  duration: number = 600
) => {
  const transition = {
    duration: duration / 1000,
    ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
  };

  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition },
    },
    slideUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0, transition },
    },
    slideDown: {
      hidden: { opacity: 0, y: -60 },
      visible: { opacity: 1, y: 0, transition },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0, transition },
    },
    slideRight: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0, transition },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition },
    },
    scaleDown: {
      hidden: { opacity: 0, scale: 1.2 },
      visible: { opacity: 1, scale: 1, transition },
    },
    rotateIn: {
      hidden: { opacity: 0, rotate: -180 },
      visible: { opacity: 1, rotate: 0, transition },
    },
    flipX: {
      hidden: { opacity: 0, rotateX: -90 },
      visible: { opacity: 1, rotateX: 0, transition },
    },
    flipY: {
      hidden: { opacity: 0, rotateY: -90 },
      visible: { opacity: 1, rotateY: 0, transition },
    },
  };

  return variants[animationType];
};

// Helper function to get CSS animation classes for non-framer-motion usage
export const getAnimationClasses = (
  animationType: AnimationType,
  inView: boolean,
  duration: number = 600
): string => {
  const durationClass = `duration-[${duration}ms]`;
  const baseClasses = `transition-all ease-out ${durationClass}`;

  if (!inView) {
    const hiddenClasses = {
      fadeIn: 'opacity-0',
      slideUp: 'opacity-0 translate-y-16',
      slideDown: 'opacity-0 -translate-y-16',
      slideLeft: 'opacity-0 translate-x-16',
      slideRight: 'opacity-0 -translate-x-16',
      scaleUp: 'opacity-0 scale-75',
      scaleDown: 'opacity-0 scale-125',
      rotateIn: 'opacity-0 -rotate-45',
      flipX: 'opacity-0 transform-gpu perspective-1000 -rotate-x-90',
      flipY: 'opacity-0 transform-gpu perspective-1000 -rotate-y-90',
    };

    return `${baseClasses} ${hiddenClasses[animationType]}`;
  }

  const visibleClasses = {
    fadeIn: 'opacity-100',
    slideUp: 'opacity-100 translate-y-0',
    slideDown: 'opacity-100 translate-y-0',
    slideLeft: 'opacity-100 translate-x-0',
    slideRight: 'opacity-100 translate-x-0',
    scaleUp: 'opacity-100 scale-100',
    scaleDown: 'opacity-100 scale-100',
    rotateIn: 'opacity-100 rotate-0',
    flipX: 'opacity-100 transform-gpu perspective-1000 rotate-x-0',
    flipY: 'opacity-100 transform-gpu perspective-1000 rotate-y-0',
  };

  return `${baseClasses} ${visibleClasses[animationType]}`;
};

// Hook for staggered animations on multiple elements
export const useStaggeredScrollAnimation = (
  itemsCount: number,
  config: UseScrollAnimationConfig = {}
) => {
  const mergedConfig = { ...defaultConfig, ...config };
  const { staggerDelay } = mergedConfig;

  const containerRef = useRef<Element>(null);
  const [inView, setInView] = useState(false);
  const [triggeredItems, setTriggeredItems] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && !inView) {
        setInView(true);
        
        // Trigger items with stagger delay
        for (let i = 0; i < itemsCount; i++) {
          setTimeout(() => {
            setTriggeredItems(prev => new Set(prev).add(i));
          }, i * staggerDelay);
        }
      }
    },
    [inView, itemsCount, staggerDelay]
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element || mergedConfig.disabled) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold: mergedConfig.threshold,
      rootMargin: mergedConfig.rootMargin,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, mergedConfig.threshold, mergedConfig.rootMargin, mergedConfig.disabled]);

  const isItemVisible = useCallback((index: number) => {
    return triggeredItems.has(index);
  }, [triggeredItems]);

  return {
    containerRef,
    inView,
    isItemVisible,
  };
};

// Performance optimized hook for multiple elements
export const useScrollAnimationObserver = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<Element, (inView: boolean) => void>>(new Map());

  const observe = useCallback((element: Element, callback: (inView: boolean) => void) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const callback = elementsRef.current.get(entry.target);
            if (callback) {
              callback(entry.isIntersecting);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -10% 0px',
        }
      );
    }

    elementsRef.current.set(element, callback);
    observerRef.current.observe(element);
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
      elementsRef.current.delete(element);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      elementsRef.current.clear();
    };
  }, []);

  return { observe, unobserve };
};