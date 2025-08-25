"use client";

import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-triggered-animation';

const projectData = [
  {
    title: "GSCC (Game System Compatibility Checker)",
    category: "Web Application", 
    client: "Gaming Community",
    duration: "Personal Project",
    description: "A tool for gamers to check if their system can handle the latest games by analyzing compatibility with a wide range of titles.",
    projectUrl: "https://iridescent-rolypoly-782dae.netlify.app/",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "GSCC Game Compatibility Checker",
  },
  {
    title: "Tracker Site (Attendance, Salary, PF & Performance)",
    category: "Management System",
    client: "Enterprise Solution", 
    duration: "Full-Stack Project",
    description: "Streamlines workforce management with real-time attendance tracking, payroll processing, provident fund contributions, and performance monitoring.",
    projectUrl: "https://wmsms.vercel.app/",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Workforce Management System",
  },
  {
    title: "Moody News",
    category: "News Platform",
    client: "Media Innovation",
    duration: "AI Project",
    description: "Personalized news curated to match your current mood.",
    projectUrl: "https://moody-news.vercel.app/",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Moody News Platform",
  },
  {
    title: "NEL (Named Entity Linking)",
    category: "AI/ML Tool",
    client: "Data Processing",
    duration: "Research Project",
    description: "Enhances text understanding by linking entities (people, organizations, locations) to their database entries for better data organization and retrieval.",
    projectUrl: "https://nel-by-ms.netlify.app/",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Named Entity Linking Tool",
  },
  {
    title: "QuantumShield Firewall",
    category: "Security Software",
    client: "Cybersecurity",
    duration: "Security Project",
    description: "Offers advanced threat detection, real-time monitoring, and user-friendly integration for digital security and network safety.",
    projectUrl: "https://fire-wall.netlify.app/",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "QuantumShield Firewall",
  },
  {
    title: "All RounderAPI",
    category: "API Service",
    client: "Developer Tools",
    duration: "API Project",
    description: "Surreal API Key Generator for secure, unique API keys to simplify and secure development processes.",
    projectUrl: "https://allrounder-api.netlify.app/",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "All RounderAPI Generator",
  },
  {
    title: "Traffic Management Wizard",
    category: "Smart City Solution",
    client: "Urban Technology",
    duration: "IoT Project",
    description: "Uses technology to optimize urban traffic flow, reduce congestion, and enhance transportation efficiency.",
    projectUrl: "https://gregarious-buttercream-270467.netlify.app/",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Traffic Management System",
  },
  {
    title: "Text Analyzer Pro",
    category: "Text Processing",
    client: "Writing Tool",
    duration: "NLP Project",
    description: "Provides insights into readability, grammar, and style to improve digital writing.",
    projectUrl: "https://analyzetex.netlify.app/",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Text Analyzer Pro",
  },
  {
    title: "CardioDetect",
    category: "Healthcare AI",
    client: "Medical Technology",
    duration: "ML Research",
    description: "Detects cancer through heartbeat analysis using advanced algorithms for early and accurate medical diagnosis.",
    projectUrl: "https://dlqmwdpj.manus.space/",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "CardioDetect Healthcare AI",
  },
  {
    title: "Face Mask Detection with Deep Learning",
    category: "Computer Vision",
    client: "Healthcare AI",
    duration: "Deep Learning Project",
    description: "Detects mask usage via a MobileNetV2-based computer vision system, capable of real-time video and image classification (with/without mask).",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Face Mask Detection AI",
  },
  {
    title: "Customer Churn Prediction",
    category: "Machine Learning",
    client: "Telecom Analytics",
    duration: "ML Pipeline",
    description: "An end-to-end ML pipeline for predicting telecom customer churn, using Random Forest and XGBoost to reach over 85% accuracy, delivering actionable churn insights.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Customer Churn Prediction",
  },
  {
    title: "Music Genre Classification",
    category: "Audio Processing",
    client: "Music Technology",
    duration: "CNN/LSTM Project",
    description: "Audio classifier using CNNs/LSTMs on MFCCs to distinguish music genres, deployed as a web app for user input.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Music Genre Classification",
  },
  {
    title: "E-Commerce Product Recommendation System",
    category: "Recommendation Engine",
    client: "E-Commerce",
    duration: "Hybrid ML System",
    description: "Hybrid recommender (collaborative + content-based filtering) that improves user engagement by suggesting products based on user history and product features.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Product Recommendation System",
  },
  {
    title: "Sentiment Analysis on Social Media",
    category: "NLP & Analytics",
    client: "Social Media Marketing",
    duration: "BERT Implementation",
    description: "Classifies tweets as positive, negative, or neutral using BERT and visualizes sentiment trends for marketing.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Social Media Sentiment Analysis",
  },
  {
    title: "Spam Mail Analyzer",
    category: "Email Security",
    client: "Cybersecurity",
    duration: "ML Classification",
    description: "Filters and analyzes potential spam emails, separating threats from normal mail to maintain email security and efficiency.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Spam Mail Analyzer",
  },
  {
    title: "SmartCity IoT",
    category: "IoT Platform",
    client: "Urban Development",
    duration: "IoT Integration",
    description: "(Optimized for PC) Integrates IoT devices into urban infrastructure to optimize resource management, decision making, and sustainable development for smart cities.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "SmartCity IoT Platform",
  },
  {
    title: "Life Goal Unleashed (Life Pattern Analyzer)",
    category: "Personal Development",
    client: "Wellness Technology",
    duration: "Analytics Platform",
    description: "Analyzes daily habits and life patterns to offer insights for personal growth, productivity, and well-being improvement.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "Life Pattern Analyzer",
  },
  {
    title: "SocialStarX",
    category: "Social Media Management",
    client: "Digital Marketing",
    duration: "Automation Platform",
    description: "Social media automation tool for post scheduling, analytics, and multi-account management to streamline digital presence.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "SocialStarX Platform",
  },
  {
    title: "ReactNative",
    category: "Mobile Development",
    client: "Cross-Platform Apps",
    duration: "Framework Implementation",
    description: "Cross-platform mobile app framework leveraging JavaScript and React for high-performance, native-like applications.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "ReactNative Development",
  },
  {
    title: "X Analytics",
    category: "Market Analysis",
    client: "Business Intelligence",
    duration: "Analytics Platform",
    description: "Market analysis platform providing detailed insights, trends, and actionable intelligence for informed decision making.",
    projectUrl: "#",
    imageUrl: "/api/placeholder/600/340",
    imageAlt: "X Analytics Platform",
  },
];

type Project = typeof projectData[0];

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <motion.div 
    className="flex justify-between items-center text-base"
    whileHover={{ x: 5 }}
    transition={{ duration: 0.2 }}
  >
    <p className="font-['Inter'] text-text-secondary">{label}:</p>
    <p className="font-['Inter'] text-text-primary">{value}</p>
  </motion.div>
);

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const cardAnimation = useScrollAnimation({
    animationType: 'slideUp',
    delay: index * 200,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={cardAnimation.ref}
      initial="hidden"
      animate={cardAnimation.inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.1 
      }}
    >
      <motion.div 
        className="bg-background-alt p-6 md:p-10 rounded-3xl transition-all duration-500 ease-out cursor-pointer relative overflow-hidden"
        whileHover={{ 
          scale: 1.02,
          y: -8,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
        whileInView={{
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10 lg:gap-[60px] relative z-10">
          <div className="flex lg:w-1/2 flex-col justify-between">
            <div>
              <motion.p 
                className="text-base text-text-secondary font-['Inter'] tracking-normal"
                whileHover={{ color: '#ff3a00' }}
                transition={{ duration: 0.2 }}
              >
                (PROJECT)
              </motion.p>
              <motion.h3 
                className="mt-4 text-3xl md:text-4xl font-semibold text-text-primary leading-tight"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {project.title}
              </motion.h3>
              <motion.p 
                className="mt-4 text-base text-text-secondary leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {project.description}
              </motion.p>
            </div>
            <div className="mt-8 flex-grow">
              <div className="flex flex-col gap-5">
                <DetailRow label="Category" value={project.category} />
                <DetailRow label="Client" value={project.client} />
                <DetailRow label="Type" value={project.duration} />
              </div>
              <div className="mt-10">
                <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                  <motion.div 
                    className="inline-flex items-center gap-4 rounded-full bg-white px-6 py-4 shadow-sm relative overflow-hidden cursor-pointer"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 8px 25px rgba(255, 58, 0, 0.15)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Button background animation */}
                    <motion.div
                      className="absolute inset-0 bg-primary rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <motion.p 
                      className="text-base font-medium text-text-primary relative z-10"
                      whileHover={{ color: '#ff3a00' }}
                      transition={{ duration: 0.2 }}
                    >
                      View Project
                    </motion.p>
                    <motion.div
                      whileHover={{ x: 5, rotate: -45 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ExternalLink className="h-4 w-4 text-text-primary group-hover:text-primary transition-colors duration-300" />
                    </motion.div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <motion.div 
              className="relative aspect-[3008/1718] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-primary/30 text-6xl font-bold"
                whileHover={{ scale: 1.1, color: 'rgba(255, 58, 0, 0.5)' }}
                transition={{ duration: 0.3 }}
              >
                {index + 1}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const WorkProjectsSection = () => {
  const sectionAnimation = useScrollAnimation({
    animationType: 'fadeIn',
    threshold: 0.1,
  });

  return (
    <motion.section 
      id="work-section" 
      className="bg-white"
      ref={sectionAnimation.ref}
      initial={{ opacity: 0 }}
      animate={sectionAnimation.inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container flex flex-col items-center gap-10 md:gap-20">
        {projectData.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default WorkProjectsSection;