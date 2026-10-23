import React from 'react';
import FeatureCard from './FeatureCard';
import { features } from '../../data/landingPageData';
import { ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * FeaturesSection Component
 * Presents the four core capabilities of the AICTE Validation System.
 */
const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Institutional Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#102D52] border border-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
          <span>Core Capabilities &amp; System Modules</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#102D52] tracking-tight leading-tight mb-4">
          Engineered for Rigorous Regulatory Scrutiny
        </h2>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          A multi-tiered verification pipeline designed to assist scrutiny committees in verifying institutional
          infrastructure, faculty credentials, and statutory legal documentation.
        </p>
      </div>

      {/* Grid of the 4 Required Feature Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            badge={feature.badge}
            description={feature.description}
            iconName={feature.iconName}
            referenceNorm={feature.referenceNorm}
            highlights={feature.highlights}
          />
        ))}
      </div>

      {/* Bottom Regulatory Compliance Assurance Strip */}
      <div className="mt-12 bg-slate-100 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3 text-slate-700">
          <span className="font-bold text-[#102D52] uppercase tracking-wider text-[11px] bg-white px-2.5 py-1 rounded border border-slate-300">
            Audit Standard
          </span>
          <span>
            Complies with AICTE Approval Process Handbook (APH) regulations and Central Vigilance Commission (CVC) audit criteria.
          </span>
        </div>
        <a
          href="#safeguards"
          className="font-bold text-[#1D4ED8] hover:text-[#102D52] shrink-0 flex items-center space-x-1"
        >
          <span>Examine Security Safeguards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};

export default FeaturesSection;
