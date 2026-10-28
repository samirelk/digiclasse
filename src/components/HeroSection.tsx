import React from 'react';
import { Play, Sparkles, CheckCircle2, MessageSquare, Shield, Clock, Database, ChevronLeft } from 'lucide-react';

interface HeroSectionProps {
  onOpenOrder: () => void;
  onOpenDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenOrder, onOpenDemo }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-white via-emerald-50/25 to-[#FBFBFA]">
      {/* Subtle Moroccan geometric lattice ambient background accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#047857_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column (RTL Start): Value Proposition & Direct CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Unboxed natural kicker */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>الجيل الجديد من الإدارة التربوية الذكية في المغرب والعالم العربي</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal">موجّه للمديرين والحراس العامين</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.25] tracking-tight mb-6 max-w-2xl">
              رقمنة شاملة للمقاعد وتتبع دقيق للغياب بالدقائق مع إشعارات{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 underline decoration-emerald-200 decoration-wavy decoration-2">
                واتساب فورية
              </span>{' '}
              لأولياء الأمور
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              منظومة إدارية متكاملة تُمكّن الحراسة العامة وإدارة المؤسسة من توزيع المقاعد بدقة في الفصول الدراسية، وتسجيل الغياب والتأخر بالساعات والدقائق، وإرسال تنبيهات واتساب سحابية رسمية وموثقة باسم مدرستك فور غياب التلميذ.
            </p>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenOrder}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-98"
              >
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>طلب النظام لمؤسستك التعليمية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDemo}
                className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-300/80 shadow-xs hover:border-slate-400 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-98 group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>تجربة المنظومة مباشرة (ديمو حي)</span>
              </button>
            </div>

            {/* Core Trust Indicators strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 w-full text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">تكامل لوائح مسار Massar</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">WhatsApp Cloud API رسمي</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">حزمة PHP & MySQL خفيفة</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">دومين واستضافة خاصة</span>
              </div>
            </div>

          </div>

          {/* Left Column (RTL End): Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer container with single elevation */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/90 bg-white p-2">
                <img
                  src="/src/assets/images/hero_school_management_1793004054318.jpg"
                  alt="لوحة إدارة المؤسسة التعليمية وتدبير الغياب"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto rounded-xl object-cover aspect-[16/10] block"
                />

                {/* Floating Real-time Metric 1: Attendance speed */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl p-3 shadow-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">سرعة رصد الغياب</div>
                    <div className="text-xs font-bold text-slate-900">أقل من 40 ثانية للقسم</div>
                  </div>
                </div>

                {/* Floating Real-time Metric 2: Instant WhatsApp delivery */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl p-3.5 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-emerald-700 font-semibold">إشعار واتساب لولي الأمر</div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>تم التسليم والقراءة</span>
                      <span className="text-emerald-600 font-mono text-[10px]">08:16 ص</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Decorative soft glow */}
              <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 rounded-3xl blur-2xl transform rotate-1" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
