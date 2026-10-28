import React, { useState } from 'react';
import { School, Menu, X, Play, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenOrder: (packageId?: 'php_standalone' | 'hosting_domain' | 'custom_training') => void;
  onOpenDemo: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrder,
  onOpenDemo,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Contract: Brand Zone — Nav Links — 1 Primary Action */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <a href="#" className="flex items-center gap-3.5 whitespace-nowrap shrink-0 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <School className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                مدرستي الذكية
              </span>
              <span className="text-xs text-slate-500 font-medium mt-1">
                منظومة تدبير المقاعد والغياب المدرسي عبر واتساب
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              المميزات التقنية
            </button>
            <button
              onClick={() => scrollToSection('partners')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              المؤسسات الشريكة
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              باقات الأسعار
            </button>
            <button
              onClick={onOpenDemo}
              className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/70"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>ديمو حي للمنظومة</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action + Discreet Tiny Admin Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Tiny, discreet button for the platform owner - does not draw attention */}
            <button
              onClick={onOpenAdmin}
              className="p-1.5 text-slate-300 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              title="إدارة المنصة"
              aria-label="إدارة المنصة"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onOpenOrder()}
              className="hidden sm:flex px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl hover:from-emerald-700 hover:to-teal-800 shadow-sm shadow-emerald-800/15 transition-all hover:shadow-md cursor-pointer whitespace-nowrap shrink-0 items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>طلب المنظومة لمؤسستك</span>
            </button>

            {/* Mobile menu hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onOpenDemo}
                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg whitespace-nowrap"
              >
                ديمو
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 flex flex-col gap-3">
            <button
              onClick={() => scrollToSection('features')}
              className="text-right px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              المميزات التقنية
            </button>
            <button
              onClick={() => scrollToSection('partners')}
              className="text-right px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              المؤسسات الشريكة
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-right px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              باقات الأسعار
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="text-right px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg flex items-center justify-between"
            >
              <span>تجربة المنظومة (ديمو حي)</span>
              <Play className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-right px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center justify-between"
            >
              <span>لوحة الإدارة والمشرف</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrder();
                }}
                className="w-full py-3 text-center text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                طلب المنظومة لمؤسستك
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
