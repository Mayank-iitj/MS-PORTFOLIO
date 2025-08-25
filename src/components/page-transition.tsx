"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Types
interface TransitionConfig {
  type: "fade" | "slide" | "scale";
  duration: number;
  delay: number;
  ease: string | number[];
  staggerChildren?: number;
}

interface PageTransitionContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  transitionConfig: TransitionConfig;
  setTransitionConfig: (config: Partial<TransitionConfig>) => void;
  triggerPageTransition: () => void;
}

interface PageTransitionProps {
  children: ReactNode;
  initialConfig?: Partial<TransitionConfig>;
  showLoadingOverlay?: boolean;
  enableSmoothScroll?: boolean;
  className?: string;
}

interface SectionRevealProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  className?: string;
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

// Default configuration
const defaultConfig: TransitionConfig = {
  type: "fade",
  duration: 0.6,
  delay: 0,
  ease: [0.25, 0.46, 0.45, 0.94],
  staggerChildren: 0.1,
};

// Animation variants
const pageVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
};

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Context
const PageTransitionContext = createContext<PageTransitionContextType | null>(
  null
);

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransition must be used within a PageTransitionProvider"
    );
  }
  return context;
};

// Loading Overlay Component
const LoadingOverlay = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-[#ff3a00]"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-medium text-[#666666]"
            >
              Loading...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Custom hook for intersection observer
const useIntersectionObserver = (
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
  triggerOnce = true
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasIntersected]);

  return {
    ref,
    isIntersecting: triggerOnce ? hasIntersected : isIntersecting,
  };
};

// Section Reveal Component
export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
  triggerOnce = true,
  delay = 0,
  className = "",
}) => {
  const { ref, isIntersecting } = useIntersectionObserver(
    threshold,
    rootMargin,
    triggerOnce
  );

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      variants={sectionVariants}
      transition={{
        ...sectionVariants.visible?.transition,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container Component
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = "",
}) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  const customStaggerVariants = {
    ...staggerContainerVariants,
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      variants={customStaggerVariants}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={staggerItemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
};

// Main PageTransition Component
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  initialConfig = {},
  showLoadingOverlay = true,
  enableSmoothScroll = true,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transitionConfig, setTransitionConfigState] = useState<TransitionConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  const setTransitionConfig = (config: Partial<TransitionConfig>) => {
    setTransitionConfigState((prev) => ({ ...prev, ...config }));
  };

  const triggerPageTransition = () => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      setIsPageTransitioning(false);
    }, transitionConfig.duration * 1000);
  };

  // Enable smooth scrolling
  useEffect(() => {
    if (enableSmoothScroll) {
      document.documentElement.style.scrollBehavior = "smooth";
      return () => {
        document.documentElement.style.scrollBehavior = "auto";
      };
    }
  }, [enableSmoothScroll]);

  // Page load effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const contextValue: PageTransitionContextType = {
    isLoading,
    setIsLoading,
    transitionConfig,
    setTransitionConfig,
    triggerPageTransition,
  };

  const currentVariants = pageVariants[transitionConfig.type];

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {showLoadingOverlay && <LoadingOverlay isVisible={isLoading} />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={isPageTransitioning ? "transitioning" : "stable"}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={currentVariants}
          transition={{
            duration: transitionConfig.duration,
            delay: transitionConfig.delay,
            ease: transitionConfig.ease,
          }}
          className={`min-h-screen ${className}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
};

// Export hook for easy access to transition functions
export const useScrollToSection = () => {
  const scrollToSection = (sectionId: string, offset = 0) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return { scrollToSection };
};

// Export transition configurations for common use cases
export const transitionPresets = {
  fast: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  normal: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  slow: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
  spring: { duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] },
  easeOut: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
};