"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { 
  Database, 
  BarChart3, 
  Code, 
  MessageSquare, 
  Brain, 
  TrendingUp,
  Zap,
  Trophy,
  Target,
  Sparkles
} from "lucide-react";

interface Skill {
  name: string;
  percentage: number;
}

interface SkillCategory {
  title: string;
  icon: any;
  skills: Skill[];
}

interface ProgressBarProps {
  skill: Skill;
  delay: number;
}

const ProgressBar = ({ skill, delay }: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setProgress(skill.percentage);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, skill.percentage, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="group"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-300">
          {skill.name}
        </span>
        <span className="text-xs font-semibold text-orange-600">
          {skill.percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, delay: delay / 1000, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AdditionalSkillBadge = ({ skill, delay }: { skill: string; delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 cursor-default shadow-sm hover:shadow-md"
    >
      {skill}
    </motion.div>
  );
};

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const skillCategories: SkillCategory[] = [
    {
      title: "Data Science & Analytics",
      icon: Database,
      skills: [
        { name: "Python", percentage: 95 },
        { name: "Data Science", percentage: 90 },
        { name: "Data Engineering", percentage: 85 },
        { name: "Data Visualization", percentage: 90 },
        { name: "Data Cleaning", percentage: 92 },
        { name: "Data Entry", percentage: 95 },
        { name: "Analytical Thinking", percentage: 95 },
      ],
    },
    {
      title: "Tools & Technologies",
      icon: Code,
      skills: [
        { name: "MS Excel", percentage: 95 },
        { name: "Advanced Excel", percentage: 95 },
        { name: "Power BI", percentage: 90 },
        { name: "VS Code", percentage: 90 },
        { name: "GitHub Copilot (GenAI)", percentage: 85 },
        { name: "Netlify", percentage: 85 },
        { name: "Wix", percentage: 80 },
      ],
    },
    {
      title: "Communication & AI Tools",
      icon: MessageSquare,
      skills: [
        { name: "English Proficiency (Written)", percentage: 95 },
        { name: "Creative Writing", percentage: 90 },
        { name: "Copywriting", percentage: 85 },
        { name: "Report Writing", percentage: 90 },
        { name: "ChatGPT", percentage: 90 },
        { name: "Cursor (GenAI)", percentage: 85 },
        { name: "Windsurf (GenAI)", percentage: 85 },
      ],
    },
  ];

  const additionalSkills = [
    "Machine Learning", "Deep Learning", "Computer Vision", "Natural Language Processing",
    "Statistical Analysis", "Feature Engineering", "Model Deployment", "A/B Testing",
    "Business Intelligence", "ETL Processes", "API Development", "Web Scraping",
    "Database Management", "Cloud Computing", "Git Version Control", "Jupyter Notebooks",
    "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Matplotlib", "Seaborn", "Plotly"
  ];

  return (
    <section
      id="skills-section"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-2xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg"
          >
            <Trophy className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            SKILLS &amp; EXPERTISE
          </h2>
          
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto"
          >
            A comprehensive overview of my technical expertise and professional capabilities
          </motion.p>
        </motion.div>

        {/* Skills Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {skillCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                className="group"
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-orange-200 h-full">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                      {category.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    {category.skills.map((skill, skillIndex) => (
                      <ProgressBar
                        key={skill.name}
                        skill={skill}
                        delay={categoryIndex * 200 + skillIndex * 100}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="w-6 h-6 text-orange-500 mr-3" />
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Additional Technologies &amp; Skills
            </h3>
            <Sparkles className="w-6 h-6 text-orange-500 ml-3" />
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <div className="flex flex-wrap gap-3 justify-center">
              {additionalSkills.map((skill, index) => (
                <AdditionalSkillBadge
                  key={skill}
                  skill={skill}
                  delay={index * 50}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex justify-center mt-16"
        >
          <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-lg">
            <Target className="w-5 h-5" />
            <span className="font-semibold">Always Learning, Always Growing</span>
            <TrendingUp className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
}