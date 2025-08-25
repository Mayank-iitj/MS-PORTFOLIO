"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-triggered-animation';
import { ExternalLink, Github } from 'lucide-react';

const MoreProjectsCta = () => {
  const ctaAnimation = useScrollAnimation({
    animationType: 'slideUp',
    threshold: 0.2,
  });

  return (
    <motion.section
      className="bg-white py-[60px] md:py-[120px] relative overflow-hidden"
      ref={ctaAnimation.ref}
      initial={{ opacity: 0 }}
      animate={ctaAnimation.inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 bg-primary/15 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={ctaAnimation.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6"
            whileHover={{ 
              scale: 1.02,
              color: '#ff3a00',
            }}
            transition={{ duration: 0.3 }}
          >
            Explore More Projects
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={ctaAnimation.inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            From AI-powered healthcare solutions to smart city IoT platforms, discover the full range of my innovative projects spanning web development, machine learning, and cutting-edge technology implementations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaAnimation.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Primary CTA */}
            <motion.a
              href="mailto:ms1591934@gmail.com?subject=Project Collaboration"
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 8px 25px rgba(255, 58, 0, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Button background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.span
                className="relative z-10"
                whileHover={{ letterSpacing: '0.05em' }}
                transition={{ duration: 0.2 }}
              >
                Let's Collaborate
              </motion.span>
              
              <motion.div
                whileHover={{ x: 5, rotate: -45 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.div>

              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                whileTap={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              href="https://github.com/mayankiitj" 
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 px-8 py-4 bg-transparent border-2 border-text-primary text-text-primary rounded-full font-semibold text-lg hover:bg-text-primary hover:text-white transition-all duration-300 relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                borderColor: '#ff3a00',
                color: '#ffffff',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button background animation */}
              <motion.div
                className="absolute inset-0 bg-text-primary"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.span
                className="relative z-10"
                whileHover={{ letterSpacing: '0.05em' }}
                transition={{ duration: 0.2 }}
              >
                View GitHub
              </motion.span>
              
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <Github className="w-5 h-5" />
              </motion.div>
            </motion.a>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaAnimation.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              { label: "AI/ML Projects", value: "10+" },
              { label: "Web Applications", value: "15+" },
              { label: "Open Source", value: "5+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-background-alt rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-primary mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MoreProjectsCta;