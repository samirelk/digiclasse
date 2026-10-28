import React from 'react';
import { PartnerSchool } from '../types';
import { 
  X, 
  Globe, 
  Lock, 
  ExternalLink, 
  School, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Bell, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface SchoolPortalPreviewModalProps {
  school: PartnerSchool | null;
  onClose: () => void;
  onOpenOrder: () => void;
}

export const SchoolPortalPreviewModal: React.FC<SchoolPortalPreviewModalProps> = ({
  school,
  onClose,
  onOpenOrder,
}) => {
  if (!school) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col max-h-[92vh]">
        
        {/* Simulated Browser URL bar */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          </div>

          {/* Browser Address Bar */}
          <div className="flex-1 max-w-lg bg-slate-800 text-slate-300 px-4 py-1.5 rounded-lg flex items-center justify-between gap-2 font-mono text-[11px] dir-ltr mx-auto">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-slate-400">https://</span>
              <span className="text-white font-bold">{school.domainName}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-sans">بوابة مستقلة</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Branded School Independent Portal Content */}
        <div className="overflow-y-auto flex-1 bg-[#FBFBFA]">
          
          {/* School Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={school.logo}
                  alt={school.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600/30 shadow-xs"
                />
                <div>
                  <div className="text-xs text-slate-500 font-semibold">{school.directorate}</div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">{school.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-emerald-700 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>منظومة الحراسة العامة وتدبير الغياب الرقمي مفعلة</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-mono">
                  السنة الدراسية 2025 - 2026
                </span>
              </div>
            </div>
          </header>

          {/* Quick Notice Banner */}
          <div className="bg-emerald-800 text-white px-6 py-2.5 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-300" />
              <span>إشعار هام لأولياء الأمور: يتم إرسال تنبيهات الغياب تلقائياً عبر واتساب في بداية كل حصة.</span>
            </div>
            <span className="text-emerald-200 font-mono text-[11px] hidden sm:inline">WhatsApp Cloud API نشط</span>
          </div>

          {/* Main Dashboard Grid */}
          <div className="p-6 space-y-6">
            
            {/* Today's Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">نسبة المواظبة اليوم:</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">98.4%</span>
                <span className="text-[10px] text-slate-400 block mt-1">حضور ممتاز</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">التلاميذ المسجلون:</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {school.studentsCount.toLocaleString('ar-MA')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">في قاعدة البيانات</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">الحجرات والقاعات:</span>
                <span className="text-2xl font-black text-slate-900 font-mono">{school.classroomsCount}</span>
                <span className="text-[10px] text-slate-400 block mt-1">مجهزة بمخطط المقاعد</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">رسائل واتساب الموثقة:</span>
                <span className="text-2xl font-black text-teal-700 font-mono">14,280+</span>
                <span className="text-[10px] text-slate-400 block mt-1">منذ بداية الموسم</span>
              </div>
            </div>

            {/* Simulated Portals Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">فضاء الحارس العام</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  مراقبة فورية لمقاعد الأقسام وحصص الغياب وطباعة شواهد المغادرة ورخص الدخول.
                </p>
                <span className="text-[11px] text-emerald-700 font-bold block">متاح فقط للإدارة التربوية</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">فضاء الأستاذ</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  رصد الغياب عبر الهاتف أو الحاسوب في أقل من 40 ثانية بواسطة خريطة المقاعد التفاعلية.
                </p>
                <span className="text-[11px] text-emerald-700 font-bold block">تسجيل دخول سريع برمز الأستاذ</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">فضاء الولي والتلميذ</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  متابعة سجل المواظبة ونقاط السلوك وإشعارات الواتساب المباشرة واستخراج كشف الغياب.
                </p>
                <span className="text-[11px] text-emerald-700 font-bold block">متاح برقم مسار والتاريخ</span>
              </div>
            </div>

            {/* System banner for this school */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-emerald-300 font-bold">بوابة سحابية خاصة بالمؤسسة</span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  تود إطلاق بوابة مستقلة مثل هذه بدومين خاص لمؤسستك التعليمية؟
                </h4>
                <p className="text-xs text-emerald-100 mt-1">
                  نحن نوفر الاستضافة، وحجز الدومين الوطني (.ma)، وتهيئة واتساب السحابي في 24 ساعة.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenOrder();
                }}
                className="px-5 py-2.5 bg-white text-emerald-900 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-all cursor-pointer whitespace-nowrap shadow-sm shrink-0"
              >
                احجز دومين واستضافة مدرستك الآن
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
