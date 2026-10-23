import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { workflowSteps } from '../../data/landingPageData';
import {
  GitMerge,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  UserCheck,
  Award,
} from 'lucide-react';

/**
 * WorkflowSection Component
 * Reproduces the structured milestone pipeline from Reference Screenshot 3.
 * Highlights the four mandatory stages:
 * 1. Application Submission
 * 2. Automated Validation
 * 3. Authorized Officer Review
 * 4. Regulatory Decision
 */
const WorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  const stepIcons = [FileCheck, ShieldAlert, UserCheck, Award];

  return (
    <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F4F7FB] border-t border-b border-slate-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Top Badge & Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-[#102D52] text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <GitMerge className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>End-to-End Scrutiny Pipeline</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#102D52] tracking-tight leading-tight mb-4">
            From Institutional Submission to{' '}
            <span className="text-[#E05A18]">Statutory Decision</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Four sequential stages ensuring automated evidence discovery, scrutiny officer oversight,
            and legally compliant regulatory decisions.
          </p>

          {/* Pipeline Milestone Status Strip (Inspired directly by Reference Screenshot 3) */}
          <div className="mt-6 inline-flex items-center space-x-3 bg-white px-4 py-2 rounded-full border border-slate-300 shadow-xs text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">Pipeline Stage: {activeStep} of 4</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">Click any stage to examine scrutiny parameters</span>
          </div>
        </div>

        {/* 4-Step Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {workflowSteps.map((item, idx) => {
            const Icon = stepIcons[idx] || CheckCircle2;
            const isSelected = activeStep === item.step;

            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`cursor-pointer rounded-xl p-6 border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#102D52] ring-2 ring-[#102D52]/20 shadow-lg -translate-y-1'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-[#102D52]">
                      {item.number}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#102D52] text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.timeline}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center space-x-2.5 mb-2.5">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-blue-50 text-[#102D52]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#102D52] leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Key Action Pill */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-700 bg-slate-50 p-2 rounded border border-slate-200/80">
                    <span className="font-bold text-[#102D52]">Key Protocol: </span>
                    {item.keyAction}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Progression Bar (Visual Connecting Line from Screenshot 3) */}
        <div className="hidden lg:block bg-white p-6 rounded-xl border border-slate-200 mb-10 shadow-xs">
          <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#102D52] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
            />

            {/* Connecting Circles */}
            <div className="relative z-10 flex justify-between items-center">
              {workflowSteps.map((step) => {
                const isPassed = step.step <= activeStep;
                return (
                  <button
                    key={step.step}
                    onClick={() => setActiveStep(step.step)}
                    className="flex flex-col items-center focus:outline-none"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-[#102D52] text-white ring-4 ring-blue-100'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {step.step}
                    </div>
                    <span
                      className={`mt-2 text-xs font-bold tracking-tight text-center max-w-[140px] ${
                        step.step === activeStep ? 'text-[#102D52]' : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stage Callout & Action */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-8 py-3.5 text-sm font-bold text-white rounded-lg bg-[#E05A18] hover:bg-[#C2410C] shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E05A18]"
          >
            <span>Access Institutional Scrutiny Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="mt-2 text-xs text-slate-500">
            Designated for AICTE Scrutiny Officers, Verification Teams, and Registered Institutions
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
