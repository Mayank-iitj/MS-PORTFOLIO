"use client";

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParallax } from '@/hooks/use-parallax';
import { useScrollAnimation } from '@/hooks/use-scroll-triggered-animation';

const HeroSection = () => {
  const parallaxY = useParallax(0.5);
  const navAnimation = useScrollAnimation({
    animationType: 'fadeIn',
    threshold: 0.1,
  });

  const textAnimation = useScrollAnimation({
    animationType: 'slideUp',
    threshold: 0.1,
    delay: 300,
  });

  const ctaAnimation = useScrollAnimation({
    animationType: 'slideUp',
    threshold: 0.1,
    delay: 600,
  });

  // Animation variants
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -90,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const navItems = ["PROJECTS", "ABOUT", "SERVICES"];
  const brandText = "MAYANK SHARMA";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <motion.section 
      className="min-h-screen bg-white flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background decorative elements with parallax */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        style={{ y: parallaxY }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-32 left-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl"
        style={{ y: parallaxY }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Navigation */}
      <motion.nav 
        className="flex justify-between items-center p-6 md:p-10 relative z-20"
        ref={navAnimation.ref}
        initial={{ opacity: 0, y: -20 }}
        animate={navAnimation.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={() => scrollToSection('hero-section')}
          className="text-base font-medium text-text-primary hover:text-primary transition-colors duration-200 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          HOME
          <motion.div
            className="absolute -bottom-1 left-0 h-0.5 bg-primary"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
        
        <motion.div 
          className="w-12 h-12 bg-text-primary rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden"
          whileHover={{ 
            scale: 1.1,
            backgroundColor: '#ff3a00',
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/6fd0d457-a59c-4654-9816-2c9af971d149-agentic-framer-website/assets/icons/jP3fJPYTLkUHB1tpds78HIZhII-1.png" 
              alt="QR Code" 
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-10 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Left Column - Navigation Links */}
            <motion.div 
              className="flex flex-col space-y-4 md:space-y-6"
              ref={textAnimation.ref}
              initial="hidden"
              animate={textAnimation.inView ? "visible" : "hidden"}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item}
                  onClick={() => {
                    if (item === "PROJECTS") scrollToSection('work-section');
                    if (item === "ABOUT") scrollToSection('about-section');
                    if (item === "SERVICES") scrollToSection('services-section');
                  }}
                  className="text-left text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary hover:text-primary transition-colors duration-300 relative group"
                  custom={index}
                  variants={letterVariants}
                  whileHover={{ 
                    x: 20,
                    textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-primary"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
              
              {/* Brand Name with Enhanced Animation */}
              <motion.div
                className="mt-8 md:mt-12 relative"
                custom={navItems.length}
                variants={letterVariants}
              >
                <motion.h1 
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-primary relative inline-block"
                  style={{ y: parallaxY }}
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: '0 8px 16px rgba(255, 58, 0, 0.3)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {brandText.split(' ').map((word, wordIndex) => (
                    <span key={wordIndex} className="inline-block mr-4">
                      {word.split('').map((letter, letterIndex) => (
                        <motion.span
                          key={letterIndex}
                          className="inline-block"
                          custom={letterIndex + wordIndex * 10}
                          variants={letterVariants}
                          whileHover={{ 
                            y: -10,
                            rotateY: 180,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                  <motion.span
                    className="text-text-primary ml-2"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    ®
                  </motion.span>
                </motion.h1>
                
                {/* Animated background accent */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </motion.div>
            </motion.div>

            {/* Right Column - Description */}
            <motion.div 
              className="flex flex-col justify-center space-y-6 md:space-y-8"
              ref={ctaAnimation.ref}
              initial={{ opacity: 0, x: 50 }}
              animate={ctaAnimation.inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4"
                whileHover={{ 
                  color: '#ff3a00',
                  scale: 1.02,
                }}
                transition={{ duration: 0.3 }}
              >
                Full-Stack Developer & AI/ML Engineer
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                I specialize in building innovative web applications, AI/ML solutions, and data-driven platforms. From healthcare AI to smart city solutions, I transform complex ideas into elegant, functional experiences.
              </motion.p>

              {/* Enhanced CTA Button */}
              <motion.button
                onClick={() => scrollToSection('work-section')}
                className="mt-8 w-16 h-16 bg-primary rounded-full flex items-center justify-center relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 8px 25px rgba(255, 58, 0, 0.3)',
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {/* Button pulse animation */}
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.3, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Rotating border */}
                <motion.div
                  className="absolute inset-0 border-2 border-white/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <ChevronDown className="w-6 h-6 text-white" />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="w-1 h-12 bg-gradient-to-b from-primary to-transparent rounded-full"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;