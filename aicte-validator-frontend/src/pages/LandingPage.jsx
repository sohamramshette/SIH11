import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import StatisticsStrip from '../components/landing/StatisticsStrip';
import PromoBanner from '../components/landing/PromoBanner';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import SafeguardsSection from '../components/landing/SafeguardsSection';
import AboutSection from '../components/landing/AboutSection';

/**
 * LandingPage Component (Phase 1)
 * Assembles all institutional landing page sections in the formal visual style
 * of the AICTE portal reference.
 */
const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section with Headline, Dual CTAs, and Status Search Bar */}
      <HeroSection />

      {/* 2. Four Key Illustrative Metrics clearly labeled as DEMO DATA */}
      <StatisticsStrip />

      {/* 3. Wide Promotional Institutional Banner */}
      <PromoBanner />

      {/* 4. Four Core Feature Blocks with Icons and Handbooks references */}
      <FeaturesSection />

      {/* 5. 4-Step Milestone Workflow Pipeline */}
      <WorkflowSection />

      {/* 6. Security Architecture, Trust Pillars, and Statutory Disclaimers */}
      <SafeguardsSection />

      {/* 7. About System, SIH Problem Statement 26261 & APH Standards */}
      <AboutSection />
    </div>
  );
};

export default LandingPage;
