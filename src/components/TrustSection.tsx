import React from 'react';
import { Layers, Crosshair, Sparkles, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const cards = [
    {
      metric: '1 Platform',
      title: 'Unified Emergency Coordination',
      description: 'Consolidates incident reporting, live bystander alerts, and roadside assistance discovery into a single interface.',
      highlight: 'Zero fragmented steps during high-stress road emergencies.',
      icon: Layers,
    },
    {
      metric: 'Location-Based',
      title: 'Hyper-Local Spatial Precision',
      description: 'Directly captures GPS telemetry to connect accidents with volunteers and resources in the immediate radius.',
      highlight: 'Ensures responders pinpoint the exact roadway corridor.',
      icon: Crosshair,
    },
    {
      metric: 'AI-Assisted',
      title: 'Intelligent Incident Organization',
      description: 'Structured accident intake formats crash severity, hazards, and victim count into clean briefs for first responders.',
      highlight: 'Designed for upcoming automated severity triage modules.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Built for Reliability</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 tracking-tight font-['Space_Grotesk',sans-serif]">
            Engineered for Fast, Community-Driven Action
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
            Focused strictly on reducing response lag through transparent, location-aware technology.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.metric}
                className="bg-neutral-50/80 rounded-2xl p-6 sm:p-8 border border-neutral-200/90 flex flex-col justify-between hover:border-neutral-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl sm:text-4xl font-black text-neutral-950 font-['Space_Grotesk',sans-serif] tracking-tight">
                      {card.metric}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 shadow-sm">
                      <Icon className="w-5 h-5 text-red-600" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                    {card.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200/70 flex items-start gap-2 text-xs font-medium text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{card.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
