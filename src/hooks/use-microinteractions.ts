"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

// Animation configuration interfaces
export interface AnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface SpringConfig {
  tension?: number;
  friction?: number;
  mass?: number;
}

export interface ButtonInteractionConfig extends AnimationConfig {
  scalePress?: number;
  scaleHover?: number;
  pressDepth?: number;
  ripple?: boolean;
  haptic?: boolean;
}

export interface IconAnimationConfig extends AnimationConfig {
  rotationAngle?: number;
  scaleActive?: number;
  morphVariants?: string[];
}

export interface FormFieldConfig extends AnimationConfig {
  focusScale?: number;
  errorShake?: boolean;
  successPulse?: boolean;
  borderWidth?: number;
}

export interface LoadingConfig extends AnimationConfig {
  type?: 'spinner' | 'pulse' | 'dots' | 'progress' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export interface ToggleConfig extends AnimationConfig {
  thumbScale?: number;
  trackStretch?: number;
  checkmarkDraw?: boolean;
}

export interface FeedbackConfig extends AnimationConfig {
  type?: 'success' | 'error' | 'warning' | 'info';
  slideDirection?: 'up' | 'down' | 'left' | 'right';
  bounce?: boolean;
}

export interface MenuConfig extends AnimationConfig {
  stagger?: number;
  slideDistance?: number;
  fadeOpacity?: number;
}

export interface RippleConfig {
  color?: string;
  opacity?: number;
  duration?: number;
  maxRadius?: number;
}

export interface MagneticConfig {
  strength?: number;
  threshold?: number;
  returnSpeed?: number;
}

// Animation state interfaces
export interface AnimationState {
  isAnimating: boolean;
  progress: number;
  currentVariant: string;
}

export interface InteractionState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isActive: boolean;
  isLoading: boolean;
  hasError: boolean;
}

// Hook return interfaces
export interface ButtonMicroInteraction {
  state: InteractionState & AnimationState;
  handlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
  styles: React.CSSProperties;
  animate: (variant: string) => void;
  triggerRipple: (event: React.MouseEvent | React.TouchEvent) => void;
}

export interface IconMicroInteraction {
  state: InteractionState & AnimationState;
  handlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
  };
  styles: React.CSSProperties;
  rotate: (angle: number) => void;
  morph: (variant: string) => void;
  pulse: () => void;
}

export interface FormFieldMicroInteraction {
  state: InteractionState & AnimationState & {
    isValid: boolean;
    isDirty: boolean;
  };
  handlers: {
    onFocus: () => void;
    onBlur: () => void;
    onChange: (value: string) => void;
  };
  styles: React.CSSProperties;
  showError: () => void;
  showSuccess: () => void;
  shake: () => void;
}

export interface LoadingMicroInteraction {
  state: AnimationState & {
    type: string;
    isVisible: boolean;
  };
  styles: React.CSSProperties;
  start: () => void;
  stop: () => void;
  setType: (type: string) => void;
}

// Utility functions
const getReducedMotionPreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// Main microinteractions hook
export const useMicroInteractions = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    setPrefersReducedMotion(getReducedMotionPreference());
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const createAnimation = useCallback((
    element: HTMLElement,
    keyframes: Keyframe[],
    config: AnimationConfig
  ): Animation | null => {
    if (prefersReducedMotion) return null;
    
    const options: KeyframeAnimationOptions = {
      duration: config.duration || 200,
      easing: config.easing || 'ease-out',
      delay: config.delay || 0,
      iterations: config.iterations || 1,
      direction: config.direction || 'normal',
      fill: config.fillMode || 'both'
    };
    
    return element.animate(keyframes, options);
  }, [prefersReducedMotion]);

  return {
    createAnimation,
    prefersReducedMotion,
    easeOutElastic,
    throttle
  };
};

// Button interactions hook
export const useButtonInteractions = (config: ButtonInteractionConfig = {}): ButtonMicroInteraction => {
  const { createAnimation, prefersReducedMotion } = useMicroInteractions();
  const elementRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const rippleTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [state, setState] = useState<InteractionState & AnimationState>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
    isActive: false,
    isLoading: false,
    hasError: false,
    isAnimating: false,
    progress: 0,
    currentVariant: 'idle'
  });

  const {
    scalePress = 0.95,
    scaleHover = 1.02,
    pressDepth = 2,
    ripple = true,
    duration = 150,
    easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  } = config;

  const animate = useCallback((variant: string) => {
    if (!elementRef.current || prefersReducedMotion) return;

    const keyframes: Keyframe[] = [];
    
    switch (variant) {
      case 'hover':
        keyframes.push(
          { transform: 'scale(1) translateY(0px)', boxShadow: '0 2px 8px rgba(255, 58, 0, 0.1)' },
          { transform: `scale(${scaleHover}) translateY(-1px)`, boxShadow: '0 8px 24px rgba(255, 58, 0, 0.15)' }
        );
        break;
      case 'press':
        keyframes.push(
          { transform: `scale(${scaleHover}) translateY(-1px)` },
          { transform: `scale(${scalePress}) translateY(${pressDepth}px)`, boxShadow: '0 1px 4px rgba(255, 58, 0, 0.1)' }
        );
        break;
      case 'release':
        keyframes.push(
          { transform: `scale(${scalePress}) translateY(${pressDepth}px)` },
          { transform: `scale(${scaleHover}) translateY(-1px)`, boxShadow: '0 8px 24px rgba(255, 58, 0, 0.15)' }
        );
        break;
      case 'idle':
        keyframes.push(
          { transform: 'scale(1) translateY(0px)', boxShadow: '0 2px 8px rgba(255, 58, 0, 0.1)' }
        );
        break;
    }

    if (animationRef.current) {
      animationRef.current.cancel();
    }

    animationRef.current = createAnimation(elementRef.current, keyframes, {
      duration,
      easing,
      fillMode: 'forwards'
    });

    setState(prev => ({ ...prev, currentVariant: variant, isAnimating: true }));
    
    if (animationRef.current) {
      animationRef.current.onfinish = () => {
        setState(prev => ({ ...prev, isAnimating: false }));
      };
    }
  }, [createAnimation, duration, easing, prefersReducedMotion, scaleHover, scalePress, pressDepth]);

  const triggerRipple = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!ripple || !elementRef.current || prefersReducedMotion) return;

    const rect = elementRef.current.getBoundingClientRect();
    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const radius = Math.sqrt(rect.width ** 2 + rect.height ** 2);

    const rippleElement = document.createElement('div');
    rippleElement.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 1000;
    `;

    elementRef.current.appendChild(rippleElement);

    const rippleAnimation = rippleElement.animate([
      { width: '0', height: '0', opacity: 1 },
      { width: `${radius * 2}px`, height: `${radius * 2}px`, opacity: 0 }
    ], {
      duration: 600,
      easing: 'ease-out'
    });

    rippleAnimation.onfinish = () => {
      if (rippleElement.parentNode) {
        rippleElement.parentNode.removeChild(rippleElement);
      }
    };
  }, [ripple, prefersReducedMotion]);

  const handlers = {
    onMouseEnter: () => {
      setState(prev => ({ ...prev, isHovered: true }));
      animate('hover');
    },
    onMouseLeave: () => {
      setState(prev => ({ ...prev, isHovered: false, isPressed: false }));
      animate('idle');
    },
    onMouseDown: () => {
      setState(prev => ({ ...prev, isPressed: true }));
      animate('press');
    },
    onMouseUp: () => {
      setState(prev => ({ ...prev, isPressed: false }));
      if (state.isHovered) {
        animate('hover');
      } else {
        animate('idle');
      }
    },
    onTouchStart: () => {
      setState(prev => ({ ...prev, isPressed: true }));
      animate('press');
    },
    onTouchEnd: () => {
      setState(prev => ({ ...prev, isPressed: false }));
      animate('idle');
    },
    onFocus: () => {
      setState(prev => ({ ...prev, isFocused: true }));
    },
    onBlur: () => {
      setState(prev => ({ ...prev, isFocused: false }));
    }
  };

  const styles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: prefersReducedMotion ? 'none' : 'background-color 200ms ease',
    outline: state.isFocused ? '2px solid var(--color-primary)' : 'none',
    outlineOffset: '2px'
  };

  return {
    state,
    handlers,
    styles,
    animate,
    triggerRipple
  };
};

// Icon interactions hook
export const useIconInteractions = (config: IconAnimationConfig = {}): IconMicroInteraction => {
  const { createAnimation, prefersReducedMotion } = useMicroInteractions();
  const elementRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<InteractionState & AnimationState>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
    isActive: false,
    isLoading: false,
    hasError: false,
    isAnimating: false,
    progress: 0,
    currentVariant: 'idle'
  });

  const {
    rotationAngle = 180,
    scaleActive = 1.1,
    duration = 200,
    easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  } = config;

  const rotate = useCallback((angle: number) => {
    if (!elementRef.current || prefersReducedMotion) return;

    const animation = createAnimation(elementRef.current, [
      { transform: 'rotate(0deg)' },
      { transform: `rotate(${angle}deg)` }
    ], { duration, easing });

    setState(prev => ({ ...prev, isAnimating: true }));
    
    if (animation) {
      animation.onfinish = () => {
        setState(prev => ({ ...prev, isAnimating: false }));
      };
    }
  }, [createAnimation, duration, easing, prefersReducedMotion]);

  const morph = useCallback((variant: string) => {
    setState(prev => ({ ...prev, currentVariant: variant }));
  }, []);

  const pulse = useCallback(() => {
    if (!elementRef.current || prefersReducedMotion) return;

    const animation = createAnimation(elementRef.current, [
      { transform: 'scale(1)', opacity: 1 },
      { transform: `scale(${scaleActive})`, opacity: 0.8 },
      { transform: 'scale(1)', opacity: 1 }
    ], { duration: duration * 2, easing });

    setState(prev => ({ ...prev, isAnimating: true }));
    
    if (animation) {
      animation.onfinish = () => {
        setState(prev => ({ ...prev, isAnimating: false }));
      };
    }
  }, [createAnimation, duration, easing, prefersReducedMotion, scaleActive]);

  const handlers = {
    onMouseEnter: () => {
      setState(prev => ({ ...prev, isHovered: true }));
      if (!prefersReducedMotion && elementRef.current) {
        createAnimation(elementRef.current, [
          { transform: 'scale(1)' },
          { transform: `scale(${scaleActive})` }
        ], { duration: 150, easing: 'ease-out', fillMode: 'forwards' });
      }
    },
    onMouseLeave: () => {
      setState(prev => ({ ...prev, isHovered: false }));
      if (!prefersReducedMotion && elementRef.current) {
        createAnimation(elementRef.current, [
          { transform: `scale(${scaleActive})` },
          { transform: 'scale(1)' }
        ], { duration: 150, easing: 'ease-out', fillMode: 'forwards' });
      }
    },
    onClick: () => {
      pulse();
    }
  };

  const styles: React.CSSProperties = {
    cursor: 'pointer',
    transition: prefersReducedMotion ? 'none' : 'color 200ms ease'
  };

  return {
    state,
    handlers,
    styles,
    rotate,
    morph,
    pulse
  };
};

// Form field interactions hook
export const useFormFieldInteractions = (config: FormFieldConfig = {}): FormFieldMicroInteraction => {
  const { createAnimation, prefersReducedMotion } = useMicroInteractions();
  const elementRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<InteractionState & AnimationState & {
    isValid: boolean;
    isDirty: boolean;
  }>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
    isActive: false,
    isLoading: false,
    hasError: false,
    isAnimating: false,
    progress: 0,
    currentVariant: 'idle',
    isValid: true,
    isDirty: false
  });

  const {
    focusScale = 1.02,
    errorShake = true,
    successPulse = true,
    duration = 200
  } = config;

  const shake = useCallback(() => {
    if (!elementRef.current || prefersReducedMotion) return;

    const animation = createAnimation(elementRef.current, [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(-2px)' },
      { transform: 'translateX(2px)' },
      { transform: 'translateX(0)' }
    ], { duration: 400, easing: 'ease-in-out' });

    setState(prev => ({ ...prev, isAnimating: true }));
    
    if (animation) {
      animation.onfinish = () => {
        setState(prev => ({ ...prev, isAnimating: false }));
      };
    }
  }, [createAnimation, prefersReducedMotion]);

  const showError = useCallback(() => {
    setState(prev => ({ ...prev, hasError: true, isValid: false }));
    if (errorShake) {
      shake();
    }
  }, [errorShake, shake]);

  const showSuccess = useCallback(() => {
    setState(prev => ({ ...prev, hasError: false, isValid: true }));
    if (successPulse && elementRef.current && !prefersReducedMotion) {
      createAnimation(elementRef.current, [
        { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
        { boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.1)' },
        { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' }
      ], { duration: 600 });
    }
  }, [successPulse, createAnimation, prefersReducedMotion]);

  const handlers = {
    onFocus: () => {
      setState(prev => ({ ...prev, isFocused: true }));
      if (!prefersReducedMotion && elementRef.current) {
        createAnimation(elementRef.current, [
          { transform: 'scale(1)', borderColor: 'var(--color-border)' },
          { transform: `scale(${focusScale})`, borderColor: 'var(--color-primary)' }
        ], { duration, fillMode: 'forwards' });
      }
    },
    onBlur: () => {
      setState(prev => ({ ...prev, isFocused: false }));
      if (!prefersReducedMotion && elementRef.current) {
        createAnimation(elementRef.current, [
          { transform: `scale(${focusScale})`, borderColor: 'var(--color-primary)' },
          { transform: 'scale(1)', borderColor: 'var(--color-border)' }
        ], { duration, fillMode: 'forwards' });
      }
    },
    onChange: (value: string) => {
      setState(prev => ({ 
        ...prev, 
        isDirty: value.length > 0,
        hasError: false
      }));
    }
  };

  const styles: React.CSSProperties = {
    transition: prefersReducedMotion ? 'none' : 'border-color 200ms ease, box-shadow 200ms ease',
    borderColor: state.hasError ? '#ef4444' : state.isFocused ? 'var(--color-primary)' : 'var(--color-border)'
  };

  return {
    state,
    handlers,
    styles,
    showError,
    showSuccess,
    shake
  };
};

// Loading interactions hook
export const useLoadingInteractions = (config: LoadingConfig = {}): LoadingMicroInteraction => {
  const { prefersReducedMotion } = useMicroInteractions();
  const [state, setState] = useState<AnimationState & {
    type: string;
    isVisible: boolean;
  }>({
    isAnimating: false,
    progress: 0,
    currentVariant: 'spinner',
    type: config.type || 'spinner',
    isVisible: false
  });

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: true, isAnimating: true }));
  }, []);

  const stop = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false, isAnimating: false }));
  }, []);

  const setType = useCallback((type: string) => {
    setState(prev => ({ ...prev, type, currentVariant: type }));
  }, []);

  const getLoadingStyles = (): React.CSSProperties => {
    if (prefersReducedMotion) {
      return { opacity: state.isVisible ? 1 : 0 };
    }

    const baseStyles: React.CSSProperties = {
      opacity: state.isVisible ? 1 : 0,
      transition: 'opacity 200ms ease'
    };

    switch (state.type) {
      case 'spinner':
        return {
          ...baseStyles,
          animation: state.isAnimating ? 'spin 1s linear infinite' : 'none'
        };
      case 'pulse':
        return {
          ...baseStyles,
          animation: state.isAnimating ? 'pulse 1.5s ease-in-out infinite' : 'none'
        };
      case 'dots':
        return {
          ...baseStyles,
          animation: state.isAnimating ? 'bounce 1.4s ease-in-out infinite' : 'none'
        };
      default:
        return baseStyles;
    }
  };

  return {
    state,
    styles: getLoadingStyles(),
    start,
    stop,
    setType
  };
};

// Feedback animations hook
export const useFeedbackInteractions = (config: FeedbackConfig = {}) => {
  const { createAnimation, prefersReducedMotion } = useMicroInteractions();
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState(config.type || 'info');

  const show = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setFeedbackType(type);
    setIsVisible(true);

    if (!prefersReducedMotion && elementRef.current) {
      createAnimation(elementRef.current, [
        { transform: 'translateY(-20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], {
        duration: config.duration || 300,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fillMode: 'forwards'
      });
    }

    // Auto hide after 3 seconds
    setTimeout(() => {
      hide();
    }, 3000);
  }, [createAnimation, prefersReducedMotion, config.duration]);

  const hide = useCallback(() => {
    if (!prefersReducedMotion && elementRef.current) {
      const animation = createAnimation(elementRef.current, [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-20px)', opacity: 0 }
      ], {
        duration: 200,
        easing: 'ease-in',
        fillMode: 'forwards'
      });

      if (animation) {
        animation.onfinish = () => setIsVisible(false);
      }
    } else {
      setIsVisible(false);
    }
  }, [createAnimation, prefersReducedMotion]);

  const getTypeStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: 9999,
      display: isVisible ? 'block' : 'none'
    };

    switch (feedbackType) {
      case 'success':
        return { ...baseStyles, backgroundColor: '#22c55e' };
      case 'error':
        return { ...baseStyles, backgroundColor: '#ef4444' };
      case 'warning':
        return { ...baseStyles, backgroundColor: '#f59e0b' };
      case 'info':
      default:
        return { ...baseStyles, backgroundColor: 'var(--color-primary)' };
    }
  };

  return {
    show,
    hide,
    isVisible,
    feedbackType,
    styles: getTypeStyles(),
    elementRef
  };
};

// Magnetic effect hook
export const useMagneticEffect = (config: MagneticConfig = {}) => {
  const { prefersReducedMotion } = useMicroInteractions();
  const elementRef = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const animationFrameRef = useRef<number>();

  const {
    strength = 0.3,
    threshold = 100,
    returnSpeed = 0.15
  } = config;

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!elementRef.current || prefersReducedMotion) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    if (distance < threshold) {
      setIsActive(true);
      const translateX = deltaX * strength;
      const translateY = deltaY * strength;
      
      elementRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
    } else if (isActive) {
      setIsActive(false);
      // Smooth return to center
      const currentTransform = elementRef.current.style.transform;
      const currentX = parseFloat(currentTransform.match(/translateX\(([^)]+)px\)/)?.[1] || '0');
      const currentY = parseFloat(currentTransform.match(/translateY\(([^)]+)px\)/)?.[1] || '0');
      
      const animate = () => {
        const newX = currentX * (1 - returnSpeed);
        const newY = currentY * (1 - returnSpeed);
        
        if (elementRef.current && Math.abs(newX) > 0.1 && Math.abs(newY) > 0.1) {
          elementRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
          animationFrameRef.current = requestAnimationFrame(animate);
        } else if (elementRef.current) {
          elementRef.current.style.transform = 'translate(0px, 0px)';
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [strength, threshold, returnSpeed, isActive, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, prefersReducedMotion]);

  return {
    elementRef,
    isActive,
    styles: {
      transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out'
    }
  };
};