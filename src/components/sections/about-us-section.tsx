"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, getAnimationClasses } from '@/hooks/use-scroll-triggered-animation';
import { StaggerContainer } from '@/components/page-transition';

const AboutUsSection = () => {
  const sectionAnimation = useScrollAnimation({
    animationType: 'fadeIn',
    threshold: 0.1,
  });

  const headerAnimation = useScrollAnimation({
    animationType: 'slideUp',
    threshold: 0.2,
    delay: 200,
  });

  const textAnimation = useScrollAnimation({
    animationType: 'slideUp',
    threshold: 0.2,
    delay: 400,
  });

  // Animation variants for staggered text reveals
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const paragraphVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      clipPath: 'inset(100% 0 0 0)',
    },
    visible: { 
      opacity: 1, 
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const highlightVariants = {
    hidden: { 
      scaleX: 0,
      transformOrigin: 'left',
    },
    visible: { 
      scaleX: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.5,
      },
    },
  };

  return (
    <motion.section 
      id="about-section" 
      className="bg-background py-[60px] md:py-[120px] relative overflow-hidden"
      ref={sectionAnimation.ref}
      initial={{ opacity: 0 }}
      animate={sectionAnimation.inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-[792px] mx-auto md:mx-0">
          <motion.div 
            className="flex flex-col gap-10"
            initial="hidden"
            animate={sectionAnimation.inView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div
              ref={headerAnimation.ref}
              variants={paragraphVariants}
            >
              <motion.p 
                className="text-base font-normal text-muted-foreground relative inline-block"
                whileHover={{ 
                  color: '#ff3a00',
                  scale: 1.05,
                }}
                transition={{ duration: 0.2 }}
              >
                (ABOUT ME)
                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary"
                  variants={highlightVariants}
                />
              </motion.p>
            </motion.div>
            
            <StaggerContainer className="flex flex-col" staggerDelay={0.2}>
              <motion.p 
                className="text-lg text-muted-foreground relative"
                variants={paragraphVariants}
              >
                I'm <motion.span 
                  className="text-primary font-semibold relative inline-block"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  MAYANK SHARMA
                </motion.span>, a passionate Full-Stack Developer and AI/ML Engineer from IIT Jodhpur. I specialize in creating innovative digital solutions that bridge the gap between cutting-edge technology and user-centered design.
              </motion.p>
              
              <motion.p 
                className="text-lg text-muted-foreground"
                variants={paragraphVariants}
              >
                My expertise spans across web development, artificial intelligence, machine learning, and data science. From building responsive web applications to developing sophisticated AI models for healthcare, gaming, and enterprise solutions, I bring a unique blend of <motion.span 
                  className="text-primary font-medium relative inline-block"
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: '0 2px 4px rgba(255, 58, 0, 0.3)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  technical proficiency and creative problem-solving
                </motion.span> to every project.
              </motion.p>
              
              <motion.p 
                className="text-lg text-muted-foreground mb-0"
                variants={paragraphVariants}
              >
                Whether it's developing a game compatibility checker, building workforce management systems, creating mood-based news platforms, or implementing advanced ML algorithms for medical diagnosis, I'm driven by the challenge of turning complex ideas into <motion.span 
                  className="text-black font-semibold relative inline-block"
                  whileHover={{ 
                    scale: 1.05,
                    color: '#ff3a00',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  elegant, functional solutions that make a real impact
                </motion.span>.
              </motion.p>
            </StaggerContainer>
          </motion.div>

          {/* Call-to-action with scroll animation */}
          <motion.div
            className="mt-12 flex justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={textAnimation.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            ref={textAnimation.ref}
          >
            <motion.a
              href="mailto:ms1591934@gmail.com"
              className="group relative px-8 py-4 bg-primary text-white rounded-full font-medium overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 8px 25px rgba(255, 58, 0, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Button background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-orange-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.span
                className="relative z-10"
                whileHover={{ letterSpacing: '0.05em' }}
                transition={{ duration: 0.2 }}
              >
                Get In Touch
              </motion.span>
              
              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                whileTap={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutUsSection;