import { useCallback, useEffect, useRef, useState } from 'react'

// Easing function type
export type EasingFunction = (t: number) => number

// Counter format types
export type CounterFormat = 'number' | 'currency' | 'percentage' | 'abbreviated'

// Counter configuration interface
export interface CounterConfig {
  start?: number
  end: number
  duration?: number
  delay?: number
  easing?: EasingFunction | string
  format?: CounterFormat
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: string
  currency?: string
  locale?: string
  step?: number
  useIntersectionObserver?: boolean
  threshold?: number
  triggerOnce?: boolean
  onStart?: () => void
  onUpdate?: (value: number) => void
  onComplete?: () => void
}

// Counter state interface
export interface CounterState {
  currentValue: number
  isAnimating: boolean
  isPaused: boolean
  hasStarted: boolean
  isInView: boolean
  progress: number
}

// Built-in easing functions
export const easingFunctions: Record<string, EasingFunction> = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  bounce: (t: number) => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  },
  elastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)
  },
  elasticOut: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }
}

// Number formatting utilities
export const formatNumber = (
  value: number,
  config: Pick<CounterConfig, 'format' | 'decimals' | 'prefix' | 'suffix' | 'separator' | 'currency' | 'locale'>
): string => {
  const {
    format = 'number',
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    currency = 'USD',
    locale = 'en-US'
  } = config

  let formattedValue: string

  switch (format) {
    case 'currency':
      formattedValue = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value)
      break

    case 'percentage':
      formattedValue = new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value / 100)
      break

    case 'abbreviated':
      formattedValue = abbreviateNumber(value, decimals)
      break

    default:
      const hasDecimals = decimals > 0
      const fixedValue = hasDecimals ? value.toFixed(decimals) : Math.round(value).toString()
      
      if (separator && Math.abs(value) >= 1000) {
        const parts = fixedValue.split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
        formattedValue = parts.join('.')
      } else {
        formattedValue = fixedValue
      }
      break
  }

  return `${prefix}${formattedValue}${suffix}`
}

// Number abbreviation utility
export const abbreviateNumber = (value: number, decimals: number = 1): string => {
  const abbreviations = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' }
  ]

  for (const { value: threshold, suffix } of abbreviations) {
    if (Math.abs(value) >= threshold) {
      const abbreviated = value / threshold
      return abbreviated.toFixed(decimals).replace(/\.0+$/, '') + suffix
    }
  }

  return value.toString()
}

// Intersection Observer hook
const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  threshold: number = 0.1,
  triggerOnce: boolean = true
) => {
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element || typeof window === 'undefined' || !window.IntersectionObserver) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting
        setIsInView(inView)
        
        if (inView && triggerOnce && !hasTriggered) {
          setHasTriggered(true)
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, triggerOnce, hasTriggered])

  return triggerOnce && hasTriggered ? true : isInView
}

// Main counter hook
export const useAnimatedCounter = (config: CounterConfig) => {
  const {
    start = 0,
    end,
    duration = 2000,
    delay = 0,
    easing = 'easeOut',
    step,
    useIntersectionObserver: useObserver = false,
    threshold = 0.1,
    triggerOnce = true,
    onStart,
    onUpdate,
    onComplete
  } = config

  const [state, setState] = useState<CounterState>({
    currentValue: start,
    isAnimating: false,
    isPaused: false,
    hasStarted: false,
    isInView: false,
    progress: 0
  })

  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const pauseTimeRef = useRef<number>(0)
  const elementRef = useRef<HTMLElement>(null)

  const isInView = useIntersectionObserver(elementRef, threshold, triggerOnce)

  const easingFn = typeof easing === 'string' ? easingFunctions[easing] || easingFunctions.easeOut : easing

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current - pauseTimeRef.current
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easingFn(progress)

    let currentValue: number
    if (step) {
      const totalSteps = Math.abs(end - start) / step
      const currentStep = Math.floor(easedProgress * totalSteps)
      currentValue = start + (currentStep * step * Math.sign(end - start))
    } else {
      currentValue = start + (end - start) * easedProgress
    }

    setState(prev => ({
      ...prev,
      currentValue,
      progress: easedProgress
    }))

    onUpdate?.(currentValue)

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      setState(prev => ({
        ...prev,
        isAnimating: false,
        currentValue: end
      }))
      onComplete?.()
    }
  }, [start, end, duration, step, easingFn, onUpdate, onComplete])

  const startAnimation = useCallback(() => {
    if (state.isAnimating) return

    setState(prev => ({
      ...prev,
      isAnimating: true,
      hasStarted: true
    }))

    onStart?.()

    const startDelay = state.hasStarted ? 0 : delay

    setTimeout(() => {
      startTimeRef.current = undefined
      pauseTimeRef.current = 0
      animationRef.current = requestAnimationFrame(animate)
    }, startDelay)
  }, [state.isAnimating, state.hasStarted, delay, animate, onStart])

  const pause = useCallback(() => {
    if (!state.isAnimating) return

    setState(prev => ({ ...prev, isPaused: true, isAnimating: false }))
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [state.isAnimating])

  const resume = useCallback(() => {
    if (!state.isPaused) return

    setState(prev => ({ ...prev, isPaused: false, isAnimating: true }))
    
    const now = performance.now()
    if (startTimeRef.current) {
      pauseTimeRef.current += now - startTimeRef.current
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [state.isPaused, animate])

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    setState({
      currentValue: start,
      isAnimating: false,
      isPaused: false,
      hasStarted: false,
      isInView: false,
      progress: 0
    })

    startTimeRef.current = undefined
    pauseTimeRef.current = 0
  }, [start])

  // Handle intersection observer trigger
  useEffect(() => {
    if (useObserver && isInView && !state.hasStarted) {
      startAnimation()
    }
  }, [useObserver, isInView, state.hasStarted, startAnimation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const formattedValue = formatNumber(state.currentValue, config)

  return {
    ...state,
    formattedValue,
    elementRef,
    start: startAnimation,
    pause,
    resume,
    reset
  }
}

// Multiple counters hook for parallel or sequential animations
export const useMultipleCounters = (
  configs: CounterConfig[],
  mode: 'parallel' | 'sequential' = 'parallel',
  sequentialDelay: number = 500
) => {
  const counters = configs.map((config, index) => {
    const modifiedConfig = mode === 'sequential' 
      ? { ...config, delay: (config.delay || 0) + (index * sequentialDelay) }
      : config
    
    return useAnimatedCounter(modifiedConfig)
  })

  const startAll = useCallback(() => {
    counters.forEach(counter => counter.start())
  }, [counters])

  const pauseAll = useCallback(() => {
    counters.forEach(counter => counter.pause())
  }, [counters])

  const resumeAll = useCallback(() => {
    counters.forEach(counter => counter.resume())
  }, [counters])

  const resetAll = useCallback(() => {
    counters.forEach(counter => counter.reset())
  }, [counters])

  const allCompleted = counters.every(counter => !counter.isAnimating && counter.hasStarted)
  const anyAnimating = counters.some(counter => counter.isAnimating)

  return {
    counters,
    startAll,
    pauseAll,
    resumeAll,
    resetAll,
    allCompleted,
    anyAnimating
  }
}

export default useAnimatedCounter