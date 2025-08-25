"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-triggered-animation';
import { StaggerContainer } from '@/components/page-transition';
import { Code, Database, Brain, Zap, Globe, Cpu } from 'lucide-react';

const skillsData = [
  {
    category: "Frontend Development",
    icon: <Code className="w-8 h-8" />,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    description: "Building modern, responsive web applications with cutting-edge technologies",
    color: "from-blue-500 to-purple-600",
  },
  {
    category: "Backend Development", 
    icon: <Database className="w-8 h-8" />,
    skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Express.js"],
    description: "Scalable server-side solutions and robust database architectures",
    color: "from-green-500 to-teal-600",
  },
  {
    category: "AI/ML Engineering",
    icon: <Brain className="w-8 h-8" />,
    skills: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "BERT"],
    description: "Advanced machine learning models and AI-powered applications",
    color: "from-purple-500 to-pink-600",
  },
  {
    category: "Data Science",
    icon: <Zap className="w-8 h-8" />,
    skills: ["Pandas", "NumPy", "Matplotlib", "Jupyter", "Apache Spark"],
    description: "Data analysis, visualization, and insights from complex datasets",
    color: "from-orange-500 to-red-600",
  },
  {
    category: "Cloud & DevOps",
    icon: <Globe className="w-8 h-8" />,
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    description: "Scalable cloud infrastructure and automated deployment pipelines",
    color: "from-cyan-500 to-blue-600",
  },
  {
    category: "Specialized Technologies",
    icon: <Cpu className="w-8 h-8" />,
    skills: ["Computer Vision", "NLP", "IoT", "Blockchain", "Mobile Dev"],
    description: "Cutting-edge technologies for innovative solutions",
    color: "from-indigo-500 to-purple-600",
  },
];

const SkillsSection = () => {
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

  const skillVariants = {
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

  return (
    <motion.section 
      id="skills-section" 
      className="bg-white py-[60px] md:py-[120px] relative overflow-hidden"
      ref={sectionAnimation.ref}
      initial={{ opacity: 0 }}
      animate={sectionAnimation.inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-32 right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
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
        className="absolute bottom-20 left-16 w-32 h-32 bg-primary/8 rounded-full blur-2xl"
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
          className="mb-16 md:mb-20 text-center"
        >
          <motion.p 
            className="text-base font-normal text-muted-foreground relative inline-block"
            whileHover={{ 
              color: '#ff3a00',
              scale: 1.05,
            }}
            transition={{ duration: 0.2 }}
          >
            (TECHNICAL EXPERTISE)
            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-primary"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </motion.p>
          
          <motion.h2
            className="mt-8 text-3xl md:text-4xl font-bold text-text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={headerAnimation.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Technologies & Skills
          </motion.h2>
        </motion.div>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            initial="hidden"
            animate={sectionAnimation.inView ? "visible" : "hidden"}
            variants={containerVariants}
            className="contents"
          >
            {skillsData.map((skill, index) => (
              <motion.div
                key={index}
                variants={skillVariants}
                className="group relative"
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-full p-6 md:p-8 rounded-3xl bg-background-alt hover:bg-white transition-all duration-500 relative overflow-hidden border border-transparent hover:border-primary/20">
                  {/* Gradient background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
                  />
                  
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white mb-6 relative z-10`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {skill.icon}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <motion.h3 
                      className="text-xl md:text-2xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {skill.category}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-muted-foreground mb-4 leading-relaxed"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {skill.description}
                    </motion.p>
                    
                    {/* Skills list */}
                    <div className="flex flex-wrap gap-2">
                      {skill.skills.map((skillName, skillIndex) => (
                        <motion.span
                          key={skillIndex}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors duration-200"
                          whileHover={{ 
                            scale: 1.05,
                            backgroundColor: 'rgba(255, 58, 0, 0.2)',
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {skillName}
                        </motion.span>
                      ))}
                    </div>
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
              Discuss Your Project
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

export default SkillsSection;