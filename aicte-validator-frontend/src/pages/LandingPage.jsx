import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import StatisticsStrip from '../components/landing/StatisticsStrip';
import FeaturesSection from '../components/landing/FeaturesSection';
import SystemPreviewSection from '../components/landing/SystemPreviewSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import SafeguardsSection from '../components/landing/SafeguardsSection';

/**
 * LandingPage Component
 * Streamlined institutional landing page for SIH evaluation.
 * Features 6 concise, non-redundant sections:
 * 1. HeroSection: Problem statement & login access
 * 2. StatisticsStrip: Illustrative synthetic demo metrics
 * 3. FeaturesSection: Key Features (Capabilities & Scrutiny Mandate)
 * 4. SystemPreviewSection: See How the System Works (Compact Preview)
 * 5. WorkflowSection: End-to-End Scrutiny Pipeline (4 stages)
 * 6. SafeguardsSection: Trust & Safeguards (Assurance & Disclaimers)
 */
const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Key Illustrative Metrics */}
      <StatisticsStrip />

      {/* 3. Key Features */}
      <FeaturesSection />

      {/* 4. See How the System Works (Interactive Preview) */}
      <SystemPreviewSection />

      {/* 5. End-to-End Scrutiny Pipeline */}
      <WorkflowSection />

      {/* 6. Trust & Safeguards */}
      <SafeguardsSection />
    </div>
  );
};

export default LandingPage;
