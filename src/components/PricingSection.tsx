import React from 'react';
import { PricingPlan } from '../types';
import { Check, Sparkles, Server, Globe, HelpCircle, Phone } from 'lucide-react';

interface PricingSectionProps {
  plans: PricingPlan[];
  onSelectPlan: (planId: 'php_standalone' | 'hosting_domain' | 'custom_training') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ plans, onSelectPlan }) => {
  return (
    <section id="pricing" className="py-20 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span>شفافية تامة بدون مصاريف خفية</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">عقود رسمية وفواتير للمؤسسات</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            باقات اشتراك مرنة تناسب كافة المؤسسات التعليمية
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            سواء كنت تملك خادمك الخاص وترغب في النسخة البرمجية، أو تفضل حلاً متكاملاً (تسليم المفتاح) مع دومين رسمي واستضافة سريعة، وفرنا لك الخيار الأمثل.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                plan.isPopular
                  ? 'bg-white border-2 border-emerald-600 shadow-xl shadow-emerald-900/10 -translate-y-1'
                  : 'bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Popular indicator */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 right-1/2 translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-black px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{plan.badge || 'الأكثر اختياراً للمدارس'}</span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  {!plan.isPopular && plan.badge && (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed min-h-[40px] mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="pb-6 mb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
                      {plan.price}
                    </span>
                    <span className="text-sm font-bold text-slate-700">{plan.currency}</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block font-medium">
                    {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold text-slate-800 block">
                    المزايا المضمنة في الباقة:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Technical Specifications table */}
                <div className="p-3.5 rounded-xl bg-[#FBFBFA] border border-slate-200/70 space-y-2 text-[11px] mb-8">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">الاستضافة:</span>
                    <span className="font-semibold text-slate-800 text-left">{plan.specs.hosting}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">الدومين:</span>
                    <span className="font-semibold text-slate-800 text-left">{plan.specs.domain}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">التثبيت:</span>
                    <span className="font-semibold text-slate-800 text-left">{plan.specs.installation}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">الدعم الفني:</span>
                    <span className="font-semibold text-slate-800 text-left">{plan.specs.support}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-3.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-98 ${
                  plan.isPopular
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>

        {/* Quick FAQ Strip for School Principals */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base mb-4">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <span>أسئلة شائعة لمديري المؤسسات والحراس العامين</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div>
              <strong className="text-slate-900 block mb-1">هل يمكن استيراد لوائح التلاميذ من مسار مباشرة؟</strong>
              <p className="leading-relaxed">
                نعم، تدعم المنظومة استيراد ملفات التلاميذ المستخرجة من بوابة مسار الرسمية بصيغة Excel أو CSV بنقرة زر واحدة مع توزيعهم التلقائي على الأقسام.
              </p>
            </div>
            <div>
              <strong className="text-slate-900 block mb-1">كيف تتم حماية رقم هاتف المؤسسة من الحظر في واتساب؟</strong>
              <p className="leading-relaxed">
                نعتمد حصرياً على WhatsApp Cloud API الرسمي من شركة Meta عبر سيرفرات سحابية موثقة ومعتمدة، مما يضمن وصول الرسائل 100% بدون أي مخاطر حظر على أرقام هواتفكم.
              </p>
            </div>
            <div>
              <strong className="text-slate-900 block mb-1">هل يمكن تثبيت النظام على سيرفر محلي بالمؤسسة؟</strong>
              <p className="leading-relaxed">
                بالتأكيد، باقة النسخة المستقلة توفر كود PHP 8.2 & MySQL كامل ومفتوح المصدر مع معالج تثبيت يشتغل على أي جهاز محلي أو خادم شبكة داخلية (LAN) أو خادم سحابي.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
