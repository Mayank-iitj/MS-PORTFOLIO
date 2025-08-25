"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-triggered-animation';
import { StaggerContainer } from '@/components/page-transition';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';

const achievementsData = [
  {
    date: "2024",
    category: "Current", 
    title: "B.Tech Computer Science Engineering",
    description: "Indian Institute of Technology (IIT) Jodhpur - Pursuing Bachelor's degree in Computer Science with focus on AI/ML and Software Engineering.",
    highlight: true,
  },
  {
    date: "2024",
    category: "Healthcare AI",
    title: "CardioDetect - Medical AI Platform",
    description: "Developed advanced ML algorithms for cancer detection through heartbeat analysis, achieving high accuracy in early medical diagnosis.",
    highlight: false,
  },
  {
    date: "2024",
    category: "Enterprise Solutions",
    title: "Workforce Management System",
    description: "Built comprehensive attendance, salary, PF & performance tracking system with real-time monitoring and automated payroll processing.",
    highlight: false,
  },
  {
    date: "2024",
    category: "AI Innovation",
    title: "Named Entity Linking (NEL) System",
    description: "Created sophisticated NLP system for entity recognition and linking, enhancing text understanding and data organization capabilities.",
    highlight: false,
  },
  {
    date: "2023",
    category: "Computer Vision",
    title: "Face Mask Detection with Deep Learning",
    description: "Implemented MobileNetV2-based CV system for real-time mask detection with 95%+ accuracy in video and image classification.",
    highlight: false,
  },
  {
    date: "2023",
    category: "Machine Learning",
    title: "Customer Churn Prediction Model",
    description: "Developed end-to-end ML pipeline using Random Forest and XGBoost, achieving 85%+ accuracy in telecom customer churn prediction.",
    highlight: false,
  },
  {
    date: "2023",
    category: "Smart Cities",
    title: "Traffic Management Wizard",
    description: "Built IoT-based traffic optimization system for urban areas, reducing congestion and enhancing transportation efficiency.",
    highlight: false,
  },
  {
    date: "2022",
    category: "NLP & Analytics",
    title: "Social Media Sentiment Analysis",
    description: "Implemented BERT-based sentiment classification system with trend visualization for marketing insights and social media monitoring.",
    highlight: false,
  },
];

const statsData = [
  { label: "Projects Completed", value: 20, suffix: "+" },
  { label: "Technologies Mastered", value: 15, suffix: "+" },
  { label: "Years of Experience", value: 3, suffix: "+" },
  { label: "Client Satisfaction", value: 98, suffix: "%" },
];

const AwardsSection = () => {
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
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const StatCounter = ({ stat, index }: { stat: typeof statsData[0], index: number }) => {
    const count = useAnimatedCounter({
      start: 0,
      end: stat.value,
      duration: 2000,
      delay: index * 200,
      useIntersectionObserver: true,
      threshold: 0.1,
      format: 'number'
    });
    
    return (
      <motion.div
        className="text-center p-6 bg-white/50 rounded-2xl backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 8px 25px rgba(255, 58, 0, 0.1)',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="text-3xl md:text-4xl font-bold text-primary mb-2"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
          ref={count.elementRef}
        >
          {count.formattedValue}{stat.suffix}
        </motion.div>
        <div className="text-sm md:text-base text-muted-foreground font-medium">
          {stat.label}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.section 
      id="awards-section" 
      className="bg-background py-[60px] md:py-[120px] relative overflow-hidden"
      ref={sectionAnimation.ref}
      initial={{ opacity: 0 }}
      animate={sectionAnimation.inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-20 right-20 w-36 h-36 bg-primary/5 rounded-full blur-3xl"
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
        className="absolute bottom-32 left-16 w-28 h-28 bg-primary/8 rounded-full blur-2xl"
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
            (ACHIEVEMENTS & EDUCATION)
            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-primary"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20"
          initial="hidden"
          animate={sectionAnimation.inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
            >
              <StatCounter stat={stat} index={index} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Timeline */}
        <StaggerContainer className="relative">
          {/* Timeline line */}
          <motion.div
            className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
          
          <motion.div
            initial="hidden"
            animate={sectionAnimation.inView ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-8 md:space-y-12"
          >
            {achievementsData.map((achievement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative flex items-start gap-6 md:gap-12 group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Timeline dot */}
                <motion.div 
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    achievement.highlight 
                      ? 'bg-gradient-to-br from-primary to-orange-500' 
                      : 'bg-primary'
                  }`}
                  whileHover={{ 
                    scale: 1.2,
                    boxShadow: '0 4px 15px rgba(255, 58, 0, 0.4)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {achievement.highlight && (
                    <motion.div
                      className="w-3 h-3 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>
                
                {/* Content */}
                <div className={`flex-1 p-6 md:p-8 rounded-3xl bg-white/50 backdrop-blur-sm group-hover:bg-white/80 transition-all duration-500 relative overflow-hidden ${
                  achievement.highlight ? 'border-2 border-primary/20' : ''
                }`}>
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <motion.div 
                        className="flex items-center gap-4 mb-2 md:mb-0"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-primary font-bold text-lg md:text-xl">
                          {achievement.date}
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                          {achievement.category}
                        </span>
                      </motion.div>
                    </div>
                    
                    <motion.h3 
                      className="text-xl md:text-2xl font-semibold text-text-primary mb-3 leading-tight"
                      whileHover={{ 
                        color: '#ff3a00',
                        x: 5,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {achievement.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-base md:text-lg text-muted-foreground leading-relaxed"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {achievement.description}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </StaggerContainer>
      </div>
    </motion.section>
  );
};

export default AwardsSection;