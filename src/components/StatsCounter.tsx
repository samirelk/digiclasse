import React from 'react';
import { Building2, LayoutGrid, Send, Award } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const stats = [
    {
      id: 'schools',
      value: '142+',
      label: 'مؤسسة تعليمية معتمدة',
      sublabel: 'عبر مختلف الأكاديميات والمديريات',
      icon: Building2,
      accent: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      id: 'classrooms',
      value: '3,850+',
      label: 'قسم وقاعة دراسية رقمية',
      sublabel: 'موزعة بمخطط مقاعد تفاعلي ثلاثي الأبعاد',
      icon: LayoutGrid,
      accent: 'text-teal-700',
      bg: 'bg-teal-50',
    },
    {
      id: 'messages',
      value: '480,000+',
      label: 'إشعار واتساب سحابي موثق',
      sublabel: 'تم إرسالها وتأكيد قراءتها من الأولياء',
      icon: Send,
      accent: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      id: 'punctuality',
      value: '99.4%',
      label: 'دقة رصد الغياب والتأخر',
      sublabel: 'انخفاض ملحوظ في الغياب غير المبرر',
      icon: Award,
      accent: 'text-amber-700',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="flex flex-col items-start p-6 rounded-2xl bg-[#FBFBFA] border border-slate-200/70 hover:border-slate-300 transition-all hover:shadow-xs group"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.accent} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono tabular-nums mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-800 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 leading-normal">
                  {stat.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
