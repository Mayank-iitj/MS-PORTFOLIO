import HeroSection from '@/components/sections/hero-section';
import WorkProjectsSection from '@/components/sections/work-projects-section';
import MoreProjectsCta from '@/components/sections/more-projects-cta';
import AboutUsSection from '@/components/sections/about-us-section';
import TeamCarouselSection from '@/components/sections/team-carousel-section';
import AwardsSection from '@/components/sections/awards-section';
import { Education } from '@/components/sections/education-section';
import SkillsSection from '@/components/sections/skills-section';
import ServicesSection from '@/components/sections/services-section';
import FooterSection from '@/components/sections/footer-section';
import { PageTransition, SectionReveal } from '@/components/page-transition';

export default function HomePage() {
  return (
    <PageTransition 
      initialConfig={{ type: 'fade', duration: 0.8 }}
      enableSmoothScroll={true}
    >
      <main className="min-h-screen">
        <HeroSection />
        
        <SectionReveal delay={0.2}>
          <div className="py-[60px] md:py-[120px]">
            <WorkProjectsSection />
          </div>
        </SectionReveal>
        
        <SectionReveal delay={0.1}>
          <div className="py-[60px] md:py-[120px]">
            <MoreProjectsCta />
          </div>
        </SectionReveal>
        
        <SectionReveal delay={0.3}>
          <AboutUsSection />
        </SectionReveal>
        
        <SectionReveal delay={0.2}>
          <Education />
        </SectionReveal>
        
        <SectionReveal delay={0.1}>
          <AwardsSection />
        </SectionReveal>
        
        <SectionReveal delay={0.2}>
          <SkillsSection />
        </SectionReveal>
        
        <SectionReveal delay={0.2}>
          <TeamCarouselSection />
        </SectionReveal>
        
        <SectionReveal delay={0.2}>
          <div className="py-[60px] md:py-[120px]">
            <ServicesSection />
          </div>
        </SectionReveal>
        
        <SectionReveal delay={0.1}>
          <FooterSection />
        </SectionReveal>
      </main>
    </PageTransition>
  );
}