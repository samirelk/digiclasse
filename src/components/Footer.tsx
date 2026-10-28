import React from 'react';
import { School, MessageSquare, Phone, Mail, MapPin, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onOpenOrder: () => void;
  onOpenDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrder, onOpenDemo }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <School className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight block">
                  مدرستي الذكية
                </span>
                <span className="text-xs text-slate-400">
                  منظومة التدبير الذكي للأقسام والمقاعد والغياب عبر واتساب
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              الحل البرمجي والسحابي الرائد المخصص للحراس العامين ومديري المؤسسات التعليمية الابتدائية والإعدادية والتأهيلية في المغرب والعالم العربي، لرقمنة الأقسام وتتبع الغياب بدقة وإشعار أولياء الأمور فورياً.
            </p>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>متوافق مع معايير حماية المعطيات الشخصية</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">روابط المنظومة</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  المميزات التقنية
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:text-emerald-400 transition-colors">
                  المؤسسات الشريكة
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-400 transition-colors">
                  باقات الاشتراك والأسعار
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenDemo}
                  className="hover:text-emerald-400 transition-colors text-right cursor-pointer"
                >
                  تجربة المنظومة (ديمو حي)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenOrder}
                  className="hover:text-emerald-400 transition-colors text-right cursor-pointer"
                >
                  طلب النظام لمؤسستك
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">الوحدات والحلول</h4>
            <ul className="space-y-2.5">
              <li>خريطة المقاعد التفاعلية ثلاثية الأبعاد</li>
              <li>تسجيل الغياب بالساعات والدقائق</li>
              <li>ربط WhatsApp Cloud API الرسمي</li>
              <li>بوابة حسابات التلاميذ والأولياء</li>
              <li>تصدير كشوفات منظومة مسار (Massar)</li>
              <li>حزمة PHP & MySQL سريعة التثبيت</li>
            </ul>
          </div>

          {/* Direct Sales and Support */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">التواصل والطلبات المباشرة</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400">واتساب المبيعات والدعم:</span>
                  <a
                    href="https://wa.me/212690976231"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-mono dir-ltr hover:text-emerald-400 transition-colors font-bold block"
                  >
                    +212 6 90 97 62 31
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400">البريد الإلكتروني المعتمد:</span>
                  <a
                    href="mailto:samirkoraji@gmail.com"
                    className="text-white font-mono dir-ltr hover:text-emerald-400 transition-colors block text-[11px]"
                  >
                    samirkoraji@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400">المقر الإداري:</span>
                  <span className="text-white font-medium">الناضور - المملكة المغربية</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenOrder}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center shadow-xs transition-colors cursor-pointer"
                >
                  طلب النظام لمؤسستك
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} مدرستي الذكية (Ecole Smart SaaS). تم التطوير وفق خصوصية المنظومة التربوية.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">سياسة الخصوصية وسرية المعطيات</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 cursor-pointer">شروط الخدمة والاتفاقيات المؤسساتية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
