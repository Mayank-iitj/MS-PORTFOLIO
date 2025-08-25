"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-triggered-animation';
import { StaggerContainer } from '@/components/page-transition';

const servicesData = [
  {
    number: "01",
    title: "Web Development & Design",
    description: "Full-stack web development using modern technologies like React, Next.js, Node.js, and Python. I create responsive, scalable web applications with intuitive user interfaces and robust backend systems."
  },
  {
    number: "02", 
    title: "AI/ML Solutions",
    description: "Advanced machine learning and AI implementations including computer vision, natural language processing, predictive analytics, and deep learning models for healthcare, gaming, and business applications."
  },
  {
    number: "03",
    title: "Data Science & Analytics",
    description: "End-to-end data science solutions from data collection and preprocessing to model deployment. Expertise in Python, TensorFlow, PyTorch, and various ML frameworks for actionable business insights."
  },
  {
    number: "04",
    title: "Enterprise Software Development",
    description: "Custom enterprise solutions including workforce management systems, attendance tracking, payroll processing, and performance monitoring platforms designed for scalability and efficiency."
  },
  {
    number: "05",
    title: "API Development & Integration",
    description: "RESTful API design and development, third-party integrations, and microservices architecture. Secure API key generation and management systems for streamlined development processes."
  },
  {
    number: "06",
    title: "Consultation & Technical Strategy",
    description: "Technical consulting for AI/ML implementation, system architecture design, technology stack selection, and digital transformation strategies tailored to your business needs."
  },
];

const ServicesSection = () => {
  const sectionAnimation = useScrollAnimation({
    animationType: 'fadeIn',
    threshold: 0.1,
  });

  const headerAnimation = useScrollAnimation({
    animationType: 'slideUp',
    threshold: 0.2,
    delay: 200,
  });

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const serviceVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const numberVariants = {
    hidden: { 
      scale: 0,
      rotate: -180,
    },
    visible: { 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  return (
    <motion.section 
      id="services-section" 
      className="bg-background relative overflow-hidden"
      ref={sectionAnimation.ref}
      initial={{ opacity: 0 }}
      animate={sectionAnimation.inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-32 right-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-32 h-32 bg-primary/8 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={headerAnimation.ref}
          initial={{ opacity: 0, y: 30 }}
          animate={headerAnimation.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <motion.p 
            className="text-base font-normal text-muted-foreground relative inline-block"
            whileHover={{ 
              color: '#ff3a00',
              scale: 1.05,
            }}
            transition={{ duration: 0.2 }}
          >
            (SERVICES)
            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-primary"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </motion.p>
        </motion.div>
        
        <StaggerContainer className="space-y-12 md:space-y-16">
          <motion.div
            initial="hidden"
            animate={sectionAnimation.inView ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-12 md:space-y-16"
          >
            {servicesData.map((service, index) => (
              <motion.div
                key={index}
                variants={serviceVariants}
                className="group relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 p-6 md:p-8 rounded-3xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-500 relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Service Number */}
                  <motion.div
                    variants={numberVariants}
                    className="flex-shrink-0 relative z-10"
                  >
                    <motion.div 
                      className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center relative overflow-hidden"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: '0 8px 25px rgba(255, 58, 0, 0.3)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Number background animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <motion.span 
                        className="text-white font-bold text-lg md:text-xl relative z-10"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 360,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {service.number}
                      </motion.span>
                    </motion.div>
                  </motion.div>
                  
                  {/* Service Content */}
                  <div className="flex-1 relative z-10">
                    <motion.h3 
                      className="text-2xl md:text-3xl font-semibold text-text-primary mb-4 leading-tight"
                      whileHover={{ 
                        color: '#ff3a00',
                        x: 10,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-base md:text-lg text-muted-foreground leading-relaxed"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {service.description}
                    </motion.p>
                    
                    {/* Hover indicator */}
                    <motion.div
                      className="mt-6 inline-flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Learn More</span>
                      <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </StaggerContainer>

        {/* Call-to-action */}
        <motion.div
          className="mt-16 md:mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.a
            href="mailto:ms1591934@gmail.com"
            className="inline-flex items-center gap-4 px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg relative overflow-hidden group"
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
              Let's Work Together
            </motion.span>
            
            <motion.div
              whileHover={{ x: 5, rotate: -45 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              →
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;