"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { GraduationCap, Calendar, MapPin, BookOpen, Award, Code, Database, Brain } from "lucide-react";

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  focusAreas: string[];
  highlights: string[];
  isCurrently: boolean;
}

const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("education-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return isVisible;
};

const educationData: EducationItem[] = [
  {
    id: "iit-jodhpur",
    degree: "B.Tech Computer Science Engineering",
    institution: "Indian Institute of Technology (IIT) Jodhpur",
    location: "Jodhpur, Rajasthan",
    period: "2022 - 2026",
    status: "Currently Pursuing",
    focusAreas: ["Artificial Intelligence & Machine Learning", "Software Engineering", "Data Science", "Algorithms & Data Structures"],
    highlights: [
      "Specialized coursework in AI/ML and Data Science",
      "Active in coding competitions and hackathons",
      "Research projects in machine learning applications",
      "Strong foundation in computer science fundamentals"
    ],
    isCurrently: true
  }
];

const FocusAreaIcon = ({ area }: { area: string }) => {
  const iconMap: { [key: string]: typeof Brain } = {
    "Artificial Intelligence & Machine Learning": Brain,
    "Software Engineering": Code,
    "Data Science": Database,
    "Algorithms & Data Structures": BookOpen
  };
  
  const IconComponent = iconMap[area] || BookOpen;
  return <IconComponent className="w-4 h-4" />;
};

export const Education = () => {
  const isVisible = useScrollAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 1.2,
        delay: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section id="education-section" className="relative py-32 px-6 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/2 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-16"
        >
          {/* Section Title */}
          <motion.div
            variants={titleVariants}
            className="text-center"
          >
            <div className="relative inline-block">
              <h2 className="text-6xl md:text-7xl font-black text-text-primary mb-4">
                (EDUCATION)
              </h2>
              <motion.div
                variants={underlineVariants}
                className="absolute bottom-0 left-0 h-1 bg-primary rounded-full"
              />
            </div>
            <p className="text-xl text-text-secondary mt-6 max-w-2xl mx-auto">
              Academic journey and continuous learning in computer science and technology
            </p>
          </motion.div>

          {/* Education Timeline */}
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto"
          >
            {educationData.map((education, index) => (
              <motion.div
                key={education.id}
                variants={itemVariants}
                className="relative"
              >
                {/* Timeline line */}
                <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/20" />
                
                {/* Education Card */}
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="relative ml-20 group"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[3.25rem] top-8 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg z-10" />
                  
                  {/* Card */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <GraduationCap className="w-6 h-6 text-primary" />
                          {education.isCurrently && (
                            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                              Currently Pursuing
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                          {education.degree}
                        </h3>
                        <h4 className="text-xl font-semibold text-text-secondary mb-3">
                          {education.institution}
                        </h4>
                        
                        <div className="flex flex-wrap gap-4 text-text-secondary">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{education.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{education.period}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Focus Areas */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Focus Areas
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {education.focusAreas.map((area, areaIndex) => (
                          <motion.div
                            key={areaIndex}
                            whileHover={{ scale: 1.05, x: 8 }}
                            className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all duration-300"
                          >
                            <FocusAreaIcon area={area} />
                            <span className="text-text-primary font-medium">{area}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h5 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Academic Highlights
                      </h5>
                      <div className="space-y-2">
                        {education.highlights.map((highlight, highlightIndex) => (
                          <motion.div
                            key={highlightIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: highlightIndex * 0.1 }}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors duration-200"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-text-secondary">{highlight}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Info Card */}
          <motion.div
            variants={itemVariants}
            className="max-w-2xl mx-auto"
          >
            <motion.div
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-xl rounded-3xl p-8 border border-primary/20"
            >
              <div className="text-center">
                <h4 className="text-xl font-bold text-text-primary mb-3">
                  Academic Philosophy
                </h4>
                <p className="text-text-secondary leading-relaxed">
                  Committed to continuous learning and staying at the forefront of technology. 
                  Combining theoretical knowledge with practical applications to solve real-world problems 
                  through innovative software solutions and cutting-edge research.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};