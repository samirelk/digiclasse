import React from 'react';
import { StatsSettings } from '../types';
import { TrendingUp, Award, Building2, Send, CheckCircle2 } from 'lucide-react';

interface StatsCounterProps {
  settings?: StatsSettings;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ settings }) => {
  // If disabled by admin or no items provided, completely remove from the public page
  if (!settings || !settings.isEnabled || !settings.items || settings.items.length === 0) {
    return null;
  }

  const icons = [Building2, Send, Award, TrendingUp, CheckCircle2];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid gap-6 lg:gap-8 ${
            settings.items.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : settings.items.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
              : settings.items.length === 3
              ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto'
              : 'grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {settings.items.map((stat, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={stat.id}
                className="flex flex-col items-start p-6 rounded-2xl bg-[#FBFBFA] border border-slate-200/70 hover:border-slate-300 transition-all hover:shadow-xs group text-right w-full"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono tabular-nums mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-800 mb-1">
                  {stat.label}
                </div>
                {stat.sublabel && (
                  <div className="text-xs text-slate-500 leading-normal">
                    {stat.sublabel}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
