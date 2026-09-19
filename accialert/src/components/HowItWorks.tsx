import React from 'react';
import { FileText, MapPin, Cpu, Users, Info, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Report',
      tagline: 'Tell us what happened.',
      description: 'Quickly select accident severity and provide critical incident details with a straightforward mobile form.',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Locate',
      tagline: 'Share the accident location.',
      description: 'Use device GPS or place a pin on the road map to accurately pinpoint where assistance is needed.',
      icon: MapPin,
    },
    {
      num: '03',
      title: 'Analyze',
      tagline: 'Emergency information is organized for quick response.',
      description: 'The report is categorized and prepared into a clear, actionable incident summary for nearby responders.',
      icon: Cpu,
    },
    {
      num: '04',
      title: 'Respond',
      tagline: 'Nearby people or responders can take action.',
      description: 'Bystanders, nearby community members, and volunteers receive notifications to render prompt roadside aid.',
      icon: Users,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-neutral-50 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/70 text-neutral-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Process & Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 tracking-tight font-['Space_Grotesk',sans-serif]">
            How AcciAlert Works
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
            A fast, 4-step coordination flow designed to minimize delays in critical minutes after a road incident.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                id={`how-step-${step.num}`}
                className="relative bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-red-600 tracking-tight">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight font-['Space_Grotesk',sans-serif]">
                    {step.title}
                  </h3>
                  
                  <p className="mt-1 text-sm font-semibold text-red-700">
                    "{step.tagline}"
                  </p>

                  <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Essential Transparency & Emergency Disclaimer Box */}
        <div className="mt-10 max-w-4xl mx-auto rounded-xl bg-amber-50/80 border border-amber-300/80 p-4 sm:p-5 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            <span className="font-bold">Important Notice on Service Scope: </span>
            AcciAlert is an open community alert platform designed to mobilize nearby civilian helpers and notify local bystanders. 
            <strong> AcciAlert does not automatically dispatch government police, ambulances, or fire services.</strong> In any life-threatening situation or serious collision, always dial your national emergency number (<strong>112 in India</strong>) first.
          </div>
        </div>

      </div>
    </section>
  );
};
