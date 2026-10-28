import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Clock, 
  MessageSquare, 
  UserCheck, 
  Calendar, 
  Server, 
  Check, 
  ArrowLeft,
  Sparkles,
  Smartphone,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

interface FeaturesSectionProps {
  onOpenDemo: () => void;
  onOpenOrder: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onOpenDemo, onOpenOrder }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'classroom' | 'whatsapp' | 'admin'>('all');

  return (
    <section id="features" className="py-20 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start text-right max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span>الهندسة الوظيفية للمنظومة</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">مُصممة وفق الإيقاع المدرسي اليومي</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            حلول رقمية متقدمة تُنهي أعباء الحراسة العامة والغياب الورقي
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            تحكّم متكامل في حجرات الدراسة، خريطة مقاعد بصرية تفاعلية، وسرعة قياسية في إشعار الأسر وحفظ بيانات المواظبة مع التوافق التام مع منظومة مسار.
          </p>

          {/* Interactive filter buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-6 p-1 bg-slate-200/60 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جميع المميزات (6)
            </button>
            <button
              onClick={() => setActiveTab('classroom')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'classroom'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              المقاعد والغياب
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              إشعارات واتساب
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              البوابة والتثبيت PHP
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Feature 1: Large Marquee Feature - 3D Seating Chart (8 cols) */}
          {(activeTab === 'all' || activeTab === 'classroom') && (
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-700">الميزة الأولى · التوزيع المكاني</span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                        خريطة المقاعد التفاعلية ثلاثية الأبعاد
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={onOpenDemo}
                    className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer"
                  >
                    <span>تجربة الخريطة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  مخطط واقعي يحاكي قاعات التدريس في المؤسسات التعليمية (طاولات فردية أو ثنائية). يتيح للأستاذ والحارس العام السحب والإفلات وتثبيت أماكن التلاميذ ذوي الاحتياجات الخاصة أو ضعاف البصر في الصفوف الأمامية، مع تلوين فوري لحالة كل مقعد (حاضر، غائب، متأخر، مبرر).
                </p>

                {/* Illustrated Screen Showcase */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                  <img
                    src="/src/assets/images/classroom_seating_dashboard_1793004055446.jpg"
                    alt="خريطة المقاعد التفاعلية ثلاثية الأبعاد"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover aspect-[16/10] group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 right-3 left-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/90 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-4 font-medium text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        <span>حاضر (26)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                        <span>غائب (2)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        <span>متأخر (1)</span>
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">مؤسسة المنار · قاعة 14</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>توزيع حسب الجنس والمستوى</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>طباعة بطاقات المقاعد PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تحديث لحظي من هاتف الأستاذ</span>
                </div>
              </div>
            </div>
          )}

          {/* Feature 2: WhatsApp Cloud API Focus Card (4 cols) */}
          {(activeTab === 'all' || activeTab === 'whatsapp') && (
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-teal-700">الميزة الثانية · التواصل الفوري</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">
                  إشعارات واتساب السحابية الرسمية
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  ربط مباشر عبر WhatsApp Cloud API التابع لشركة Meta. إرسال تنبيه رسمي فوري برقم موثق باسم مدرستك لولي الأمر في الدقيقة نفسها التي يُسجل فيها الغياب، مما يقضي تماماً على ظاهرة الغياب غير المعلوم.
                </p>

                {/* Smartphone Mockup */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                  <img
                    src="/src/assets/images/whatsapp_parent_notification_1793004055359.jpg"
                    alt="إشعار الغياب عبر واتساب لولي الأمر"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>بدون حظر للأرقام (Cloud API رسمي)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>قوالب معتمدة باللغة العربية والفرنسية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تأكيد استلام وقراءة فوري (Double Check)</span>
                </div>
              </div>
            </div>
          )}

          {/* Feature 3: Minute-Level Attendance (4 cols) */}
          {(activeTab === 'all' || activeTab === 'classroom') && (
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-amber-700">الميزة الثالثة · الدقة والتوثيق</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">
                  تسجيل الغياب بالساعات والدقائق
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  تحديد دقيق لوقت التحاق التلميذ بالحصة (تأخر 5 أو 15 دقيقة)، مع خانة لسبب التبرير (شهادة طبية، إذن إداري، وسائل النقل) وأرشيف تاريخي غير قابل للتلاعب.
                </p>
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-1.5">
                  <div className="font-bold flex items-center justify-between">
                    <span>تأخر مسجل: 15 دقيقة</span>
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-amber-200">08:15 ص</span>
                  </div>
                  <p className="text-amber-800/90 text-[11px]">
                    السبب: تأخر النقل المدرسي · تم التبرير إلكترونياً وتحديث كشف الحراسة العامة.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تصدير مباشر لقوائم مسار (Massar Excel)</span>
              </div>
            </div>
          )}

          {/* Feature 4: Student & Parent Portal (4 cols) */}
          {(activeTab === 'all' || activeTab === 'admin') && (
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-blue-700">الميزة الرابعة · بوابة المستفيدين</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">
                  بوابة حسابات التلاميذ وأولياء الأمور
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  بوابة رقمية مخصصة لكل تلميذ وولي أمر برقم سري، للاطلاع على كشف الغيابات المفصل، سجل المشاركات الصفية، ورصيد النقاط السلوكية والمكافآت التقديرية.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                    <span className="font-semibold text-slate-800">نقاط السلوك والانضباط</span>
                    <span className="font-bold text-emerald-700 font-mono">19.5 / 20</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                    <span className="font-semibold text-slate-800">مجموع ساعات الغياب</span>
                    <span className="font-bold text-slate-700 font-mono">2 ساعات (مبررة)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700">
                <Eye className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>إشعار تلقائي بالشهادات الطبية المرفوعة</span>
              </div>
            </div>
          )}

          {/* Feature 5: Teacher Timetables & Admin Tasks (4 cols) */}
          {(activeTab === 'all' || activeTab === 'admin') && (
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-indigo-700">الميزة الخامسة · الجداول والتنظيم</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">
                  جداول حصص الأساتذة والمهام الإدارية
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  خريطة إشغال الحجرات الدراسية، تدبير حصص الحراسة والمداومة، وإدارة رخص وتغيبات الأساتذة مع إمكانية إشعار الأقسام تلقائياً بأي تعويض زمني للحصة.
                </p>
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/60 text-xs text-indigo-900">
                  <span className="font-bold block mb-1">إشغال الحجرات الذكي:</span>
                  <span className="text-[11px] text-indigo-800/90 leading-relaxed block">
                    كشف لحظي للحجرات الشاغرة لإجراء حصص الدعم أو الأنشطة الموازية بدون أي تضارب في الجداول.
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تنبيه فوري لتعويضات الحصص</span>
              </div>
            </div>
          )}

          {/* Feature 6: Full-Width Card: PHP & MySQL Engine and Easy Installer */}
          {(activeTab === 'all' || activeTab === 'admin') && (
            <div className="lg:col-span-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white border border-slate-700 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                    <Server className="w-4 h-4" />
                    <span>البنية التحتية والسهولة التقنية</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
                    توافق تام مع PHP 8.2 & MySQL ومعالج تثبيت تلقائي في 3 دقائق
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                    بُنيت المنظومة لتتوافق 100% مع كافة بيئات الاستضافة المشتركة (cPanel، DirectAdmin، Plesk) أو الخوادم السحابية الخاصة (VPS). معالج تثبيت رسومي يرشدك خطوة بخطوة لربط قاعدة البيانات وإنشاء حساب المشرف فوراً دون أي تعقيد.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>لا يتطلب خوادم باهظة (يعمل على استضافة بسيطة)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>أمان عالي وتشفير كامل لكلمات المرور والمعطيات</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>نسخ احتياطي يومي لقاعدة البيانات بضغطة زر</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-800/60 border border-slate-700 text-center">
                  <div className="text-xs text-emerald-400 font-bold mb-2">تسليم فوري أو استضافة جاهزة</div>
                  <div className="text-xl font-bold mb-3">جاهز لبدء التجربة؟</div>
                  <button
                    onClick={onOpenDemo}
                    className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md cursor-pointer mb-2"
                  >
                    تجربة لوحة التحكم مباشرة
                  </button>
                  <button
                    onClick={onOpenOrder}
                    className="w-full py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                  >
                    طلب تثبيت النظام لمؤسستك
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
