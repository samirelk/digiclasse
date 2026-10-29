import React, { useState } from 'react';
import { PurchaseOrder, PricingPlan } from '../types';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  MessageSquare, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackageId?: 'php_standalone' | 'hosting_domain' | 'custom_training';
  plans?: PricingPlan[];
  onSubmitOrder: (order: Omit<PurchaseOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => PurchaseOrder;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  selectedPackageId = 'hosting_domain',
  plans,
  onSubmitOrder,
}) => {
  const [formData, setFormData] = useState({
    schoolName: '',
    contactPerson: '',
    roleTitle: 'مدير المؤسسة',
    phone: '',
    whatsapp: '',
    email: '',
    city: '',
    requestedDomain: '',
    selectedPackage: selectedPackageId,
    notes: '',
  });

  const [submittedOrder, setSubmittedOrder] = useState<PurchaseOrder | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [domainType, setDomainType] = useState<'subdomain' | 'custom'>('subdomain');
  const [subdomainPrefix, setSubdomainPrefix] = useState('');

  // Reset or sync when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        selectedPackage: selectedPackageId,
      }));
      setSubmittedOrder(null);
      setErrors({});
      setDomainType('subdomain');
      setSubdomainPrefix('');
    }
  }, [isOpen, selectedPackageId]);

  if (!isOpen) return null;

  // Compute clean subdomain slug from school name or prefix
  const getCleanSlug = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const calculatedSubdomain = subdomainPrefix.trim()
    ? `${getCleanSlug(subdomainPrefix)}.digiclasse.com`
    : formData.schoolName.trim()
    ? `ecole-${Math.floor(100 + Math.random() * 900)}.digiclasse.com`
    : 'ecole.digiclasse.com';

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.schoolName.trim()) errs.schoolName = 'يرجى إدخال اسم المؤسسة التعليمية';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'يرجى إدخال اسم المسؤول';
    if (!formData.phone.trim()) errs.phone = 'يرجى إدخال رقم الهاتف للتواصل';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'يرجى إدخال بريد إلكتروني صالح';
    }
    if (!formData.city.trim()) errs.city = 'يرجى إدخال المدينة أو المديرية';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const matchedPlan = plans?.find((p) => p.id === formData.selectedPackage);
    let totalAmount = matchedPlan
      ? `${matchedPlan.price} ${matchedPlan.currency}`
      : (formData.selectedPackage === 'php_standalone'
          ? '1,200 درهم'
          : formData.selectedPackage === 'custom_training'
          ? '4,000 درهم'
          : '2,200 درهم');

    const finalDomain =
      domainType === 'subdomain'
        ? (subdomainPrefix.trim() ? `${getCleanSlug(subdomainPrefix)}.digiclasse.com` : 'ecole.digiclasse.com')
        : (formData.requestedDomain.trim() || 'ecole.digiclasse.com');

    const newOrder = onSubmitOrder({
      schoolName: formData.schoolName,
      contactPerson: formData.contactPerson,
      roleTitle: formData.roleTitle,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      email: formData.email,
      city: formData.city,
      requestedDomain: finalDomain,
      selectedPackage: formData.selectedPackage,
      notes: formData.notes,
      totalAmount,
    });

    setSubmittedOrder(newOrder);
  };

  // WhatsApp click generator
  const getWhatsAppLink = () => {
    if (!submittedOrder) return '#';
    const matchedPlan = plans?.find((p) => p.id === submittedOrder.selectedPackage);
    const packageDesc = matchedPlan
      ? `${matchedPlan.name} (${matchedPlan.price} ${matchedPlan.currency})`
      : (submittedOrder.selectedPackage === 'hosting_domain'
          ? 'باقة الاستضافة والدومين الفرعي الخاص (2200 درهم)'
          : submittedOrder.selectedPackage === 'php_standalone'
          ? 'باقة الحزمة المستقلة Self-Host (1200 درهم)'
          : 'باقة الدعم والتدريب والتخصيص الشامل (4000 درهم)');

    const message = `السلام عليكم ورحمة الله،
أنا: ${submittedOrder.contactPerson} (${submittedOrder.roleTitle})
من مؤسسة: ${submittedOrder.schoolName} - ${submittedOrder.city}
رقم الطلب: ${submittedOrder.orderNumber}
الباقة المختارة: ${packageDesc}
الموقع الفرعي المطلوب: ${submittedOrder.requestedDomain}
أود تأكيد طلبنا ومتابعة إجراءات التثبيت والتسليم. شكراً لكم.`;

    return `https://wa.me/212690976231?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#FBFBFA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                طلب اقتناء المنظومة وحجز الدومين لمؤسستك
              </h3>
              <p className="text-xs text-slate-500">
                تأكيد فوري ودعم فني مباشر لتشغيل النظام في مؤسستكم
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submittedOrder ? (
            /* Success confirmation screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-9 h-9" />
              </div>
              
              <h4 className="text-2xl font-black text-slate-900 mb-2">
                تم استلام طلبكم بنجاح!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                شكراً لثقتكم. تم تسجيل بيانات مؤسسة{' '}
                <strong className="text-slate-900">"{submittedOrder.schoolName}"</strong>{' '}
                في النظام، وتم توليد رقم الطلب المرجعي:
              </p>

              <div className="inline-block p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center mb-8">
                <span className="text-xs text-emerald-800 block mb-1">رقم الطلب المرجعي:</span>
                <span className="text-2xl font-black text-emerald-900 font-mono tracking-wider">
                  {submittedOrder.orderNumber}
                </span>
                <span className="text-[11px] text-emerald-700 block mt-1">
                  الباقة: {submittedOrder.totalAmount} · مسجلة في لوحة الإدارة
                </span>
              </div>

              {/* Instant WhatsApp Confirmation */}
              <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-emerald-300 text-right mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-emerald-950 mb-1">
                      تأكيد الطلب الفوري عبر واتساب
                    </h5>
                    <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                      يمكنكم النقر مباشرة أدناه للتواصل مع المشرف التقني عبر واتساب مع رسالة جاهزة تتضمن رقم طلبكم ومواصفات مؤسستكم للتسليم السريع:
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4 ml-1" />
                        <span>فتح محادثة واتساب الفورية (+212 6 90 97 62 31)</span>
                      </a>
                    </div>
                    <div className="mt-3 pt-3 border-t border-emerald-200/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-emerald-800">
                      <span>البريد المعتمد: <strong className="font-mono">samirkoraji@gmail.com</strong></span>
                      <span>·</span>
                      <span>المقر الإداري: <strong>الناضور - المملكة المغربية</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  إغلاق والعودة للموقع
                </button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Package selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  اختر باقة الاشتراك المطلوبة:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(plans && plans.length > 0 ? plans : [
                    { id: 'hosting_domain', name: 'باقة الاستضافة والدومين الفرعي الخاص', price: '2,200', currency: 'درهم', period: 'سنوياً', isPopular: true },
                    { id: 'php_standalone', name: 'باقة الحزمة المستقلة (Self-Host)', price: '1,200', currency: 'درهم', period: 'دائم', isPopular: false },
                    { id: 'custom_training', name: 'باقة الدعم والتدريب والتخصيص الشامل', price: '4,000', currency: 'درهم', period: 'سنوياً', isPopular: false },
                  ]).map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`relative flex flex-col p-3 rounded-xl border text-right cursor-pointer transition-all ${
                        formData.selectedPackage === pkg.id
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedPackage"
                        value={pkg.id}
                        checked={formData.selectedPackage === pkg.id}
                        onChange={() => setFormData({ ...formData, selectedPackage: pkg.id as any })}
                        className="sr-only"
                      />
                      <span className="text-xs font-bold text-slate-900">{pkg.name}</span>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold mt-1">
                        {pkg.price} {pkg.currency || 'درهم'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* School and Contact inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    اسم المؤسسة التعليمية <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="مثال: ثانوية المسيرة التأهيلية"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
                    />
                  </div>
                  {errors.schoolName && <p className="text-[11px] text-rose-500 mt-1">{errors.schoolName}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    المدينة / المديرية الإقليمية <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="مثال: الدار البيضاء - أنفا"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
                    />
                  </div>
                  {errors.city && <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Responsible person and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    اسم المسؤول عن الطلب <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="الاسم الكامل"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
                    />
                  </div>
                  {errors.contactPerson && <p className="text-[11px] text-rose-500 mt-1">{errors.contactPerson}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    الصفة / المهمة الإدارية
                  </label>
                  <select
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden cursor-pointer"
                  >
                    <option value="مدير المؤسسة">مدير المؤسسة التعليمية</option>
                    <option value="حارس عام للخارجية">حارس عام للخارجية</option>
                    <option value="حارس عام للداخلية">حارس عام للداخلية</option>
                    <option value="ناظر الدروس">ناظر الدروس</option>
                    <option value="الرئيس المؤسس (مؤسسة خاصة)">الرئيس المؤسس (مؤسسة خاصة)</option>
                    <option value="مسير إداري / تقني">مسير إداري / تقني</option>
                  </select>
                </div>
              </div>

              {/* Phone, WhatsApp, and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    رقم الهاتف <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="06XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden dir-ltr text-right"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    رقم الواتساب للتواصل
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="06XXXXXXXX (اختياري)"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden dir-ltr text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    البريد الإلكتروني <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="direction@ecole.ma"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden dir-ltr text-right"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Subdomain & Domain Selector */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>تحديد عنوان الموقع الإلكتروني للمؤسسة:</span>
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setDomainType('subdomain')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        domainType === 'subdomain'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      موقع فرعي: *.digiclasse.com
                    </button>
                    <button
                      type="button"
                      onClick={() => setDomainType('custom')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        domainType === 'custom'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      دومين خاص (.ma / .com)
                    </button>
                  </div>
                </div>

                {domainType === 'subdomain' ? (
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1 font-medium">
                      اختر الاسم الفرعي لمدرستكم (مثال: ecole أو اسم الثانوية بالإنجليزية):
                    </label>
                    <div className="flex items-center dir-ltr border border-slate-300 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600">
                      <span className="px-3 py-2 bg-slate-100 text-slate-500 font-mono text-xs border-r border-slate-200">
                        https://
                      </span>
                      <input
                        type="text"
                        placeholder="ecole-almassira"
                        value={subdomainPrefix}
                        onChange={(e) => setSubdomainPrefix(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono text-emerald-900 font-bold outline-hidden"
                      />
                      <span className="px-3 py-2 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border-l border-emerald-200">
                        .digiclasse.com
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>العنوان المباشر المخصص لمنظومتكم:</span>
                      <span className="font-mono text-emerald-800 font-bold dir-ltr">
                        https://{calculatedSubdomain}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1 font-medium">
                      أدخل الدومين الخاص المطلوب:
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: lycee-almassira.ma أو college-atlas.ma"
                      value={formData.requestedDomain}
                      onChange={(e) => setFormData({ ...formData, requestedDomain: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden dir-ltr text-right font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      سيتكفل فريقنا التقني بحجز النطاق الوطني (.ma) وربطه مجاناً.
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ملاحظات أو مواصفات خاصة (عدد الأقسام، نوع الفصول، إلخ):
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: نود ربط 24 حجرة دراسية ونرغب في دورة تدريبية للحراس العامين في أقرب وقت..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden resize-none"
                />
              </div>

              {/* Submission button */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>معلوماتكم محمية ومؤمنة تماماً</span>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال الطلب وحجز المنظومة</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
