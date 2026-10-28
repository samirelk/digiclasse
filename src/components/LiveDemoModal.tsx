import React, { useState } from 'react';
import { DemoStudent, AttendanceStatus, WhatsAppNotification } from '../types';
import { 
  X, 
  Play, 
  RotateCcw, 
  Send, 
  MessageSquare, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileSpreadsheet, 
  Smartphone,
  Shield,
  Sparkles,
  Users,
  Volume2
} from 'lucide-react';

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: DemoStudent[];
  onOpenOrder: () => void;
}

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  isOpen,
  onClose,
  students: initialStudents,
  onOpenOrder,
}) => {
  const [activeRole, setActiveRole] = useState<'teacher' | 'parent' | 'supervisor'>('teacher');
  const [students, setStudents] = useState<DemoStudent[]>(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState<DemoStudent | null>(null);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  // Live WhatsApp notifications log
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>([
    {
      id: 'notif-1',
      studentName: 'حمزة الوردي',
      parentPhone: '0663344556',
      type: 'غياب الحصة',
      time: '08:15 ص',
      status: 'read',
      message: 'إشعار غياب: نحيطكم علماً بتسجيل غياب ابنكم عن الحصة الأولى (الرياضيات). نرجو التواصل مع الحراسة العامة لتبرير الغياب.',
    },
    {
      id: 'notif-2',
      studentName: 'يوسف بنسليمان',
      parentPhone: '0665566778',
      type: 'تأخر بالدقائق',
      time: '08:20 ص',
      status: 'read',
      message: 'إشعار تأخر: التحق ابنكم بالقسم متأخراً بـ 15 دقيقة عن موعد الحصة. تم تدوين التأخر في سجل المواظبة.',
    },
  ]);

  if (!isOpen) return null;

  // Toggle student status on click
  const handleToggleStudentStatus = (studentId: string) => {
    // Play light click feedback sound using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // AudioContext fallback
    }

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        // Cycle: present -> absent -> late -> excused -> present
        let nextStatus: AttendanceStatus = 'present';
        let lateMin = undefined;
        let reason = undefined;

        if (s.status === 'present') {
          nextStatus = 'absent';
          reason = 'غير مبرر - الحصة الحالية';
        } else if (s.status === 'absent') {
          nextStatus = 'late';
          lateMin = 15;
          reason = 'تأخر صباحي';
        } else if (s.status === 'late') {
          nextStatus = 'excused';
          reason = 'إذن إدارة / شهادة طبية';
        } else {
          nextStatus = 'present';
        }

        const updated = {
          ...s,
          status: nextStatus,
          lateMinutes: lateMin,
          excuseReason: reason,
        };
        if (selectedStudent?.id === s.id) {
          setSelectedStudent(updated);
        }
        return updated;
      })
    );
  };

  // Trigger simulated WhatsApp dispatch
  const handleSendWhatsAppAlerts = () => {
    const absentOrLate = students.filter((s) => s.status === 'absent' || s.status === 'late');
    if (absentOrLate.length === 0) {
      setSendSuccessMessage('جميع التلاميذ حاضرون حالياً! لا توجد حالات غياب لإرسالها.');
      setTimeout(() => setSendSuccessMessage(null), 3500);
      return;
    }

    setIsSendingWhatsApp(true);
    setSendSuccessMessage(null);

    setTimeout(() => {
      setIsSendingWhatsApp(false);
      const newNotifs: WhatsAppNotification[] = absentOrLate.map((s) => ({
        id: `notif-${Date.now()}-${s.id}`,
        studentName: s.name,
        parentPhone: s.parentPhone,
        type: s.status === 'absent' ? 'غياب الحصة' : 'تأخر بالدقائق',
        time: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
        message:
          s.status === 'absent'
            ? `إشعار غياب فوري: نحيطكم علماً بتسجيل غياب ابنكم/ابنتكم (${s.name}) عن الحصة الدراسية الآن. المرجو تبرير الغياب لدى الحراسة العامة.`
            : `إشعار تأخر: وصل التلميذ (${s.name}) إلى القسم متأخراً بـ ${s.lateMinutes || 15} دقيقة. تم تسجيل التأخر.`,
      }));

      setNotifications((prev) => [...newNotifs, ...prev]);
      setSendSuccessMessage(`تم بنجاح إرسال ${absentOrLate.length} إشعار واتساب سحابي موثق إلى أولياء الأمور!`);
      setTimeout(() => setSendSuccessMessage(null), 5000);
    }, 1200);
  };

  // Metrics
  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const lateCount = students.filter((s) => s.status === 'late').length;
  const excusedCount = students.filter((s) => s.status === 'excused').length;
  const attendanceRate = Math.round(((presentCount + lateCount) / students.length) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col max-h-[95vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#FBFBFA] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  محاكي المنظومة التفاعلي المباشر (Live Sandbox)
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  بيئة حية
                </span>
              </div>
              <p className="text-xs text-slate-500">
                جرب النظام كأستاذ يرصد المقاعد، أو كمدير، أو عاين شاشة هاتف ولي الأمر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setStudents(initialStudents);
                setSelectedStudent(null);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg cursor-pointer"
              title="إعادة تعيين الطلاب"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط الحصة</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Switcher Toolbar */}
        <div className="px-6 py-3 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveRole('teacher')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeRole === 'teacher'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>أستاذ الحصة (خريطة المقاعد)</span>
            </button>
            <button
              onClick={() => setActiveRole('parent')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeRole === 'parent'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>هاتف ولي الأمر (واتساب)</span>
            </button>
            <button
              onClick={() => setActiveRole('supervisor')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeRole === 'supervisor'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>الحراسة العامة والإدارة</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">نسبة المواظبة الآن:</span>
            <span className="font-bold text-slate-900 font-mono text-sm bg-white px-2 py-0.5 rounded-lg border border-slate-200">
              {attendanceRate}%
            </span>
          </div>
        </div>

        {/* Scrollable Role Workspace */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* ROLE 1: TEACHER / SEATING CHART */}
          {activeRole === 'teacher' && (
            <div className="space-y-6">
              
              {/* Classroom header strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FBFBFA] border border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">مؤسسة المنار الذكية · الثالثة إعدادي 2</div>
                  <div className="text-base font-bold text-slate-900">
                    مادة الرياضيات · الحصة الأولى (08:00 - 09:00)
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500" />
                    <span>حاضر: <strong className="font-mono">{presentCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-rose-500" />
                    <span>غائب: <strong className="font-mono">{absentCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-amber-500" />
                    <span>متأخر: <strong className="font-mono">{lateCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-purple-500" />
                    <span>مبرر: <strong className="font-mono">{excusedCount}</strong></span>
                  </div>
                </div>

                {/* Send Alerts Button */}
                <button
                  onClick={handleSendWhatsAppAlerts}
                  disabled={isSendingWhatsApp}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSendingWhatsApp ? 'جاري الإرسال عبر WhatsApp Cloud API...' : 'إرسال إشعارات واتساب الفورية'}
                  </span>
                </button>
              </div>

              {/* Feedback alert */}
              {sendSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{sendSuccessMessage}</span>
                  </div>
                  <button
                    onClick={() => setActiveRole('parent')}
                    className="text-emerald-700 underline text-[11px] cursor-pointer"
                  >
                    معاينة هاتف الولي الآن &larr;
                  </button>
                </div>
              )}

              {/* Front of Class / Interactive Whiteboard */}
              <div className="w-full py-2 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-xl text-center text-xs font-bold text-slate-300 shadow-inner flex items-center justify-center gap-2">
                <span>مكتب الأستاذ والسبورة التفاعلية (مقدمة القاعة)</span>
              </div>

              {/* 3D Seating Grid - 12 Desks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {students.map((st) => {
                  let statusBg = 'bg-white border-slate-200 hover:border-slate-300';
                  let statusBadge = 'bg-emerald-100 text-emerald-800';
                  let statusLabel = 'حاضر';

                  if (st.status === 'absent') {
                    statusBg = 'bg-rose-50/70 border-rose-300 shadow-rose-100';
                    statusBadge = 'bg-rose-600 text-white';
                    statusLabel = 'غائب';
                  } else if (st.status === 'late') {
                    statusBg = 'bg-amber-50/70 border-amber-300 shadow-amber-100';
                    statusBadge = 'bg-amber-500 text-white';
                    statusLabel = `متأخر (${st.lateMinutes || 15}د)`;
                  } else if (st.status === 'excused') {
                    statusBg = 'bg-purple-50/70 border-purple-300';
                    statusBadge = 'bg-purple-600 text-white';
                    statusLabel = 'مبرر';
                  }

                  return (
                    <div
                      key={st.id}
                      onClick={() => {
                        handleToggleStudentStatus(st.id);
                        setSelectedStudent(st);
                      }}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer group shadow-xs active:scale-97 ${statusBg}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono text-slate-400 font-bold">
                          طاولة #{st.seatNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusBadge}`}>
                          {statusLabel}
                        </span>
                      </div>

                      <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                        {st.name}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span className="font-mono text-[10px] text-slate-400">{st.code}</span>
                        <span className="text-emerald-700 font-semibold font-mono">
                          {st.behaviorScore}/20 سلوك
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>انقر لتغيير الحالة</span>
                        <span className="text-slate-300">&larr;</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span>💡 انقر على أي مقعد دراسي لتغيير الحالة فورياً بين: </span>
                <strong className="text-emerald-700">حاضر</strong> &larr;{' '}
                <strong className="text-rose-600">غائب</strong> &larr;{' '}
                <strong className="text-amber-600">متأخر بالدقائق</strong> &larr;{' '}
                <strong className="text-purple-600">مبرر</strong>.
              </div>

            </div>
          )}

          {/* ROLE 2: PARENT WHATSAPP PHONE VIEW */}
          {activeRole === 'parent' && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-full max-w-md bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
                {/* Simulated Phone Notch */}
                <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
                
                {/* Phone Screen */}
                <div className="bg-[#ECE5DD] rounded-[2rem] overflow-hidden min-h-[460px] flex flex-col justify-between text-right border border-slate-300">
                  
                  {/* WhatsApp Chat Header */}
                  <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold text-xs border border-white/20">
                        م.ذ
                      </div>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1">
                          <span>إدارة ثانوية المنار الذكية</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" title="حساب رسمي موثق" />
                        </div>
                        <div className="text-[10px] text-emerald-200 font-mono">
                          حساب أعمال رسمي (WhatsApp Business)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Bubble Scroll */}
                  <div className="p-3 space-y-3 overflow-y-auto max-h-[340px]">
                    
                    <div className="text-center my-2">
                      <span className="bg-white/80 backdrop-blur-xs text-[10px] text-slate-600 px-3 py-1 rounded-full shadow-xs">
                        اليوم · تنبيهات المواظبة المدرسية الرسمية
                      </span>
                    </div>

                    {notifications.map((notif) => (
                      <div key={notif.id} className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/60 max-w-[92%] ml-auto">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 border-b border-slate-100 pb-1 mb-1.5">
                          <span>{notif.type} · {notif.studentName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 mt-1.5 font-mono">
                          <span>تم التسليم والقراءة</span>
                          <span className="text-emerald-700 font-bold">✓✓</span>
                        </div>
                      </div>
                    ))}

                    {/* Interactive quick reply simulation */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-900 mt-4">
                      <span className="font-bold block mb-1">رد الولي السريع:</span>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            alert('تم تسجيل استلامكم للإشعار وسيتم إبلاغ الحارس العام بالتبرير.');
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-right font-medium text-[11px] cursor-pointer"
                        >
                          📩 تأكيد الاستلام: سأحضر الشهادة الطبية غداً صباحاً
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* WhatsApp Bottom Bar */}
                  <div className="bg-[#F0F0F0] p-2.5 flex items-center gap-2 border-t border-slate-300 text-xs text-slate-500">
                    <div className="flex-1 bg-white rounded-full px-4 py-1.5 border border-slate-300 text-right text-[11px] text-slate-400">
                      اكتب ردك للحراسة العامة...
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#128C7E] text-white flex items-center justify-center shrink-0">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ROLE 3: SUPERVISOR & PRINCIPAL VIEW */}
          {activeRole === 'supervisor' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500">إجمالي الأقسام النشطة:</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono mt-1">36 قسم</div>
                  <span className="text-[11px] text-emerald-700 font-medium">كل الأقسام مرتبطة بالشبكة</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500">مجموع رسائل واتساب اليوم:</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                    {notifications.length} رسالة مرسلة
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">نسبة الوصول 100% بدون أي حظر</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500">تكامل كشوفات مسار:</span>
                  <div className="text-sm font-bold text-slate-900 mt-2">
                    جاهز للتصدير الفوري
                  </div>
                  <button
                    onClick={() => alert('تم توليد ملف غياب اليوم بصيغة Excel المتوافقة مع منصة مسار (Massar)!')}
                    className="mt-2 px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>تصدير ملف مسار (Excel)</span>
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-3 bg-slate-100 font-bold text-xs text-slate-800">
                  سجل الغيابات والتأخرات للحصة الجارية (مباشر من الحجرات)
                </div>
                <table className="w-full text-xs text-right border-collapse">
                  <thead className="bg-[#FBFBFA] border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="p-3">اسم التلميذ</th>
                      <th className="p-3">رقم المسار</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">السبب / التبرير</th>
                      <th className="p-3">إشعار ولي الأمر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students
                      .filter((s) => s.status !== 'present')
                      .map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{st.name}</td>
                          <td className="p-3 font-mono text-slate-500">{st.code}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                st.status === 'absent'
                                  ? 'bg-rose-100 text-rose-800'
                                  : st.status === 'late'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {st.status === 'absent' ? 'غياب' : st.status === 'late' ? 'تأخر' : 'مبرر'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">{st.excuseReason || 'في انتظار إفادة الولي'}</td>
                          <td className="p-3">
                            <span className="text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تم الإرسال للرقم {st.parentPhone}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-[#FBFBFA] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-600">
            أعجبك النظام؟ احصل على نسختك مع الدومين والاستضافة خلال 24 ساعة.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenOrder();
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>طلب المنظومة لمؤسستك الآن</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
