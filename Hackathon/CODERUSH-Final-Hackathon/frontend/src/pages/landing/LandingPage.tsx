import React from 'react';
import { LandingNavbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ImpactMetrics } from './components/ImpactMetrics';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { HowItWorks } from './components/HowItWorks';
import { RoleShowcase } from './components/RoleShowcase';
import { ClinicalFeatures } from './components/ClinicalFeatures';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CtaBanner } from './components/CtaBanner';
import { LandingFooter } from './components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f0f7f6] text-slate-800 antialiased font-sans selection:bg-teal-100 selection:text-teal-900">
      <LandingNavbar />
      <main>
        <HeroSection />
        <ImpactMetrics />
        <InteractiveSimulator />
        <HowItWorks />
        <RoleShowcase />
        <ClinicalFeatures />
        <TestimonialsSection />
        <CtaBanner />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
