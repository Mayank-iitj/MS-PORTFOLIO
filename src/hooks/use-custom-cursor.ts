"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorState {
  type: 'default' | 'hover' | 'click' | 'loading' | 'text' | 'button' | 'image' | 'disabled';
  scale: number;
  color: string;
  blendMode: string;
  shape: 'circle' | 'square' | 'cross' | 'arrow';
  text?: string;
}

interface CursorTrail {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  id: string;
}

interface UseCustomCursorOptions {
  enabled?: boolean;
  hideNativeCursor?: boolean;
  cursorSize?: number;
  animationDuration?: number;
  easingFunction?: string;
  trailEnabled?: boolean;
  trailLength?: number;
  particlesEnabled?: boolean;
  particleCount?: number;
  blendMode?: GlobalCompositeOperation;
  colors?: {
    default: string;
    hover: string;
    click: string;
    loading: string;
    text: string;
    button: string;
    image: string;
  };
  selectors?: {
    text: string[];
    button: string[];
    image: string[];
    hover: string[];
  };
}

const defaultOptions: UseCustomCursorOptions = {
  enabled: true,
  hideNativeCursor: true,
  cursorSize: 20,
  animationDuration: 150,
  easingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  trailEnabled: false,
  trailLength: 10,
  particlesEnabled: false,
  particleCount: 6,
  blendMode: 'normal',
  colors: {
    default: '#ff3a00',
    hover: '#ff6b3d',
    click: '#e6330b',
    loading: '#ff8c66',
    text: '#000000',
    button: '#ff3a00',
    image: '#ffffff',
  },
  selectors: {
    text: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '[data-cursor="text"]'],
    button: ['button', 'a[href]', '[data-cursor="button"]', '[role="button"]'],
    image: ['img', 'video', '[data-cursor="image"]'],
    hover: ['[data-cursor="hover"]'],
  },
};

export const useCustomCursor = (options: UseCustomCursorOptions = {}) => {
  const opts = { ...defaultOptions, ...options };
  
  const [isClient, setIsClient] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<CursorState>({
    type: 'default',
    scale: 1,
    color: opts.colors?.default || '#ff3a00',
    blendMode: 'normal',
    shape: 'circle',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<CursorTrail[]>([]);
  const [particles, setParticles] = useState<any[]>([]);

  const rafId = useRef<number>();
  const lastTime = useRef<number>(0);
  const velocity = useRef<CursorPosition>({ x: 0, y: 0 });
  const trailCounter = useRef(0);

  // Detect touch device and client-side rendering
  useEffect(() => {
    setIsClient(true);
    const checkTouch = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    setIsTouchDevice(checkTouch());
  }, []);

  // Interpolation function for smooth cursor movement
  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  }, []);

  // Animation loop with RAF
  const animate = useCallback((currentTime: number) => {
    if (!lastTime.current) lastTime.current = currentTime;
    const deltaTime = currentTime - lastTime.current;
    const factor = Math.min(deltaTime / (opts.animationDuration || 150), 1);

    // Smooth cursor following
    const newX = lerp(position.x, targetPosition.x, factor * 0.15);
    const newY = lerp(position.y, targetPosition.y, factor * 0.15);

    // Calculate velocity for effects
    velocity.current = {
      x: newX - position.x,
      y: newY - position.y,
    };

    setPosition({ x: newX, y: newY });

    // Update trails
    if (opts.trailEnabled) {
      setTrails((prevTrails) => {
        const newTrail: CursorTrail = {
          x: newX,
          y: newY,
          opacity: 1,
          scale: cursorState.scale * 0.8,
          id: `trail-${trailCounter.current++}`,
        };

        const updatedTrails = [newTrail, ...prevTrails]
          .slice(0, opts.trailLength || 10)
          .map((trail, index) => ({
            ...trail,
            opacity: 1 - (index / (opts.trailLength || 10)),
            scale: trail.scale * (1 - index * 0.1),
          }));

        return updatedTrails;
      });
    }

    lastTime.current = currentTime;
    rafId.current = requestAnimationFrame(animate);
  }, [position, targetPosition, cursorState.scale, opts.animationDuration, opts.trailEnabled, opts.trailLength, lerp]);

  // Mouse movement handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setTargetPosition({ x: e.clientX, y: e.clientY });
    if (!isVisible) setIsVisible(true);
  }, [isVisible]);

  // Mouse enter/leave handlers
  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Mouse down/up handlers
  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsClicking(true);
    setCursorState(prev => ({ 
      ...prev, 
      type: 'click', 
      scale: 0.8,
      color: opts.colors?.click || '#e6330b'
    }));

    // Create click particles if enabled
    if (opts.particlesEnabled) {
      const newParticles = Array.from({ length: opts.particleCount || 6 }, (_, i) => ({
        id: `particle-${Date.now()}-${i}`,
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        decay: 0.02,
      }));
      setParticles(prev => [...prev, ...newParticles]);
    }
  }, [opts.colors?.click, opts.particlesEnabled, opts.particleCount]);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
    setCursorState(prev => ({ 
      ...prev, 
      scale: 1,
      type: prev.type === 'click' ? 'default' : prev.type,
      color: prev.type === 'click' ? (opts.colors?.default || '#ff3a00') : prev.color
    }));
  }, [opts.colors?.default]);

  // Element hover detection
  const updateCursorForElement = useCallback((element: Element | null) => {
    if (!element) {
      setCursorState(prev => ({
        ...prev,
        type: 'default',
        scale: 1,
        color: opts.colors?.default || '#ff3a00',
        blendMode: 'normal',
        shape: 'circle',
        text: undefined,
      }));
      return;
    }

    const tagName = element.tagName.toLowerCase();
    const cursorType = element.getAttribute('data-cursor');
    const text = element.textContent;

    // Check for specific cursor types
    if (cursorType) {
      switch (cursorType) {
        case 'text':
          setCursorState(prev => ({
            ...prev,
            type: 'text',
            scale: 1.2,
            color: opts.colors?.text || '#000000',
            shape: 'cross',
          }));
          return;
        case 'button':
          setCursorState(prev => ({
            ...prev,
            type: 'button',
            scale: 1.5,
            color: opts.colors?.button || '#ff3a00',
            text: 'CLICK',
          }));
          return;
        case 'loading':
          setCursorState(prev => ({
            ...prev,
            type: 'loading',
            scale: 1.3,
            color: opts.colors?.loading || '#ff8c66',
          }));
          return;
      }
    }

    // Auto-detect based on selectors
    const isText = opts.selectors?.text?.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
    const isButton = opts.selectors?.button?.some(selector => 
      element.matches(selector) || element.closest(selector)
    );
    const isImage = opts.selectors?.image?.some(selector => 
      element.matches(selector) || element.closest(selector)
    );

    if (isButton) {
      setCursorState(prev => ({
        ...prev,
        type: 'button',
        scale: 1.5,
        color: opts.colors?.button || '#ff3a00',
        blendMode: 'multiply',
      }));
    } else if (isImage) {
      setCursorState(prev => ({
        ...prev,
        type: 'image',
        scale: 2,
        color: opts.colors?.image || '#ffffff',
        blendMode: 'difference',
      }));
    } else if (isText) {
      setCursorState(prev => ({
        ...prev,
        type: 'text',
        scale: 0.5,
        color: opts.colors?.text || '#000000',
        shape: 'cross',
      }));
    } else {
      setCursorState(prev => ({
        ...prev,
        type: 'hover',
        scale: 1.2,
        color: opts.colors?.hover || '#ff6b3d',
      }));
    }
  }, [opts.colors, opts.selectors]);

  // Mouse over handler for element detection
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    updateCursorForElement(target);
  }, [updateCursorForElement]);

  // Scroll handler to update cursor during scroll
  const handleScroll = useCallback(() => {
    // Add subtle scroll-based effects
    setCursorState(prev => ({
      ...prev,
      scale: Math.max(0.8, prev.scale * 0.95),
    }));
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!isClient || isTouchDevice || !opts.enabled) return;

    // Hide native cursor
    if (opts.hideNativeCursor) {
      document.body.style.cursor = 'none';
      const style = document.createElement('style');
      style.textContent = `
        *, *:hover, *:active, *:focus {
          cursor: none !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.body.style.cursor = '';
        document.head.removeChild(style);
      };
    }
  }, [isClient, isTouchDevice, opts.enabled, opts.hideNativeCursor]);

  useEffect(() => {
    if (!isClient || isTouchDevice || !opts.enabled) return;

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('scroll', handleScroll);

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('scroll', handleScroll);

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isClient, isTouchDevice, opts.enabled, handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp, handleMouseOver, handleScroll, animate]);

  // Update particles animation
  useEffect(() => {
    if (!opts.particlesEnabled) return;

    const particleAnimation = () => {
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - particle.decay,
          vx: particle.vx * 0.98,
          vy: particle.vy * 0.98,
        }))
        .filter(particle => particle.life > 0)
      );
    };

    const interval = setInterval(particleAnimation, 16);
    return () => clearInterval(interval);
  }, [opts.particlesEnabled]);

  // Render cursor components
  const CursorComponent = () => {
    if (!isClient || isTouchDevice || !opts.enabled || !isVisible) return null;

    const size = (opts.cursorSize || 20) * cursorState.scale;

    return (
      <>
        {/* Main cursor */}
        <div
          className="fixed pointer-events-none z-[9999] transition-opacity duration-200"
          style={{
            left: position.x - size / 2,
            top: position.y - size / 2,
            width: size,
            height: size,
            backgroundColor: cursorState.color,
            borderRadius: cursorState.shape === 'circle' ? '50%' : 
                          cursorState.shape === 'square' ? '4px' : '50%',
            transform: cursorState.shape === 'cross' ? 'rotate(45deg)' : 'none',
            mixBlendMode: cursorState.blendMode as GlobalCompositeOperation,
            opacity: isVisible ? 1 : 0,
            transition: `all ${opts.animationDuration}ms ${opts.easingFunction}`,
          }}
        >
          {cursorState.text && (
            <span
              className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ fontSize: size * 0.2 }}
            >
              {cursorState.text}
            </span>
          )}
        </div>

        {/* Loading animation */}
        {cursorState.type === 'loading' && (
          <div
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: position.x - size,
              top: position.y - size,
              width: size * 2,
              height: size * 2,
            }}
          >
            <div
              className="w-full h-full border-2 border-transparent rounded-full animate-spin"
              style={{
                borderTopColor: cursorState.color,
                borderRightColor: cursorState.color,
              }}
            />
          </div>
        )}

        {/* Trail effect */}
        {opts.trailEnabled && trails.map((trail, index) => (
          <div
            key={trail.id}
            className="fixed pointer-events-none z-[9997]"
            style={{
              left: trail.x - (size * trail.scale) / 2,
              top: trail.y - (size * trail.scale) / 2,
              width: size * trail.scale,
              height: size * trail.scale,
              backgroundColor: cursorState.color,
              borderRadius: '50%',
              opacity: trail.opacity * 0.6,
              mixBlendMode: 'multiply',
            }}
          />
        ))}

        {/* Particles */}
        {opts.particlesEnabled && particles.map((particle) => (
          <div
            key={particle.id}
            className="fixed pointer-events-none z-[9996] w-2 h-2 rounded-full"
            style={{
              left: particle.x - 4,
              top: particle.y - 4,
              backgroundColor: cursorState.color,
              opacity: particle.life,
              transform: `scale(${particle.life})`,
            }}
          />
        ))}
      </>
    );
  };

  // Utility functions for external control
  const setCursor = useCallback((newState: Partial<CursorState>) => {
    setCursorState(prev => ({ ...prev, ...newState }));
  }, []);

  const resetCursor = useCallback(() => {
    setCursorState({
      type: 'default',
      scale: 1,
      color: opts.colors?.default || '#ff3a00',
      blendMode: 'normal',
      shape: 'circle',
    });
  }, [opts.colors?.default]);

  const hideCursor = useCallback(() => {
    setIsVisible(false);
  }, []);

  const showCursor = useCallback(() => {
    setIsVisible(true);
  }, []);

  return {
    CursorComponent,
    position,
    cursorState,
    isVisible,
    isEnabled: isClient && !isTouchDevice && opts.enabled,
    setCursor,
    resetCursor,
    hideCursor,
    showCursor,
    utils: {
      updateCursorForElement,
      lerp,
    },
  };
};

export default useCustomCursor;