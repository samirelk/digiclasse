import React, { useState } from 'react';
import { PartnerSchool, PurchaseOrder, OrderStatus, EducationLevel, SchoolStatus, PricingPlan } from '../types';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Search, 
  Building, 
  ExternalLink, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle, 
  Clock, 
  Filter,
  Check,
  AlertTriangle,
  FileSpreadsheet,
  Key,
  User,
  LogIn,
  Sparkles,
  Database,
  Code2,
  Copy,
  FileCode,
  Tag,
  Coins,
  RotateCcw,
  Save,
  HelpCircle
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: PartnerSchool[];
  orders: PurchaseOrder[];
  pricingPlans: PricingPlan[];
  onAddSchool: (school: Omit<PartnerSchool, 'id'>) => void;
  onUpdateSchool: (school: PartnerSchool) => void;
  onDeleteSchool: (schoolId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePricingPlan: (plan: PricingPlan) => void;
  onResetPricingPlans: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  schools,
  orders,
  pricingPlans,
  onAddSchool,
  onUpdateSchool,
  onDeleteSchool,
  onUpdateOrderStatus,
  onUpdatePricingPlan,
  onResetPricingPlans,
}) => {
  // Authentication State for platform manager
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab - default to orders for the platform owner
  const [activeTab, setActiveTab] = useState<'orders' | 'schools' | 'pricing' | 'stats' | 'php_package'>('orders');
  const [selectedPhpFile, setSelectedPhpFile] = useState<'sql' | 'config' | 'whatsapp' | 'readme'>('sql');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Pricing draft state & notification
  const [pricingDrafts, setPricingDrafts] = useState<Record<string, {
    price: string;
    currency: string;
    period: string;
    name: string;
    badge: string;
    description: string;
    ctaText: string;
    isPopular: boolean;
    featuresText: string;
  }>>({});
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Search & Filters
  const [schoolsSearch, setSchoolsSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [ordersSearch, setOrdersSearch] = useState('');

  // School Form (Add or Edit)
  const [isSchoolFormOpen, setIsSchoolFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<PartnerSchool | null>(null);
  const [schoolFormData, setSchoolFormData] = useState({
    name: '',
    code: '',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=120&q=80',
    city: 'الرباط',
    directorate: 'المديرية الإقليمية بالرباط',
    educationLevel: 'تأهيلي' as EducationLevel,
    joinDate: 'اليوم، 2025',
    websiteUrl: 'https://ecole.digiclasse.com',
    domainName: 'ecole.digiclasse.com',
    studentsCount: 1200,
    classroomsCount: 30,
    status: 'نشط' as SchoolStatus,
  });

  // Selected Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const u = usernameInput.trim().toLowerCase();
    const p = passwordInput.trim();

    if (
      (u === 'admin' || u === 'admin@digiclasse.com' || u.length > 0) &&
      (p === 'admin123' || p === 'admin')
    ) {
      setIsAuthenticated(true);
      setAuthError('');
      setActiveTab('orders');
    } else {
      setAuthError('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
    }
  };

  const openAddSchool = () => {
    setEditingSchool(null);
    setSchoolFormData({
      name: '',
      code: `SCH-${Math.floor(100 + Math.random() * 900)}`,
      logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=120&q=80',
      city: 'الرباط',
      directorate: 'المديرية الإقليمية بالرباط',
      educationLevel: 'تأهيلي',
      joinDate: 'اليوم',
      websiteUrl: 'https://nouvelle-ecole.digiclasse.com',
      domainName: 'nouvelle-ecole.digiclasse.com',
      studentsCount: 850,
      classroomsCount: 24,
      status: 'نشط',
    });
    setIsSchoolFormOpen(true);
  };

  const openEditSchool = (school: PartnerSchool) => {
    setEditingSchool(school);
    setSchoolFormData({
      name: school.name,
      code: school.code,
      logo: school.logo,
      city: school.city,
      directorate: school.directorate,
      educationLevel: school.educationLevel,
      joinDate: school.joinDate,
      websiteUrl: school.websiteUrl,
      domainName: school.domainName,
      studentsCount: school.studentsCount,
      classroomsCount: school.classroomsCount,
      status: school.status,
    });
    setIsSchoolFormOpen(true);
  };

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolFormData.name.trim()) return;

    if (editingSchool) {
      onUpdateSchool({
        ...editingSchool,
        ...schoolFormData,
      });
    } else {
      onAddSchool(schoolFormData);
    }
    setIsSchoolFormOpen(false);
  };

  // Pricing Plan Draft Helpers
  const getDraft = (plan: PricingPlan) => {
    return (
      pricingDrafts[plan.id] || {
        price: plan.price,
        currency: plan.currency,
        period: plan.period,
        name: plan.name,
        badge: plan.badge || '',
        description: plan.description,
        ctaText: plan.ctaText,
        isPopular: !!plan.isPopular,
        featuresText: plan.features.join('\n'),
      }
    );
  };

  const updateDraft = (
    planId: string,
    partial: Partial<{
      price: string;
      currency: string;
      period: string;
      name: string;
      badge: string;
      description: string;
      ctaText: string;
      isPopular: boolean;
      featuresText: string;
    }>
  ) => {
    const currentPlan = pricingPlans.find((p) => p.id === planId);
    if (!currentPlan) return;
    const current = getDraft(currentPlan);
    setPricingDrafts((prev) => ({
      ...prev,
      [planId]: { ...current, ...partial },
    }));
  };

  const handleSavePlan = (plan: PricingPlan) => {
    const draft = getDraft(plan);
    const updatedFeatures = draft.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const updatedPlan: PricingPlan = {
      ...plan,
      price: draft.price.trim(),
      currency: draft.currency.trim(),
      period: draft.period.trim(),
      name: draft.name.trim(),
      badge: draft.badge.trim() || undefined,
      description: draft.description.trim(),
      ctaText: draft.ctaText.trim(),
      isPopular: draft.isPopular,
      features: updatedFeatures.length > 0 ? updatedFeatures : plan.features,
    };

    onUpdatePricingPlan(updatedPlan);
    setSaveSuccessMessage(`تم بنجاح حفظ وتحديث "${draft.name}" بسعر ${draft.price} ${draft.currency}!`);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleResetPrices = () => {
    if (confirm('هل أنت متأكد من رغبتك في استعادة الأسعار الافتراضية (1200 درهم / 2200 درهم / 4000 درهم)؟')) {
      setPricingDrafts({});
      onResetPricingPlans();
      setSaveSuccessMessage('تمت استعادة أثمنة الباقات الافتراضية بنجاح.');
      setTimeout(() => setSaveSuccessMessage(null), 3500);
    }
  };

  // Export orders to CSV
  const handleExportOrdersCSV = () => {
    const headers = ['رقم الطلب', 'المؤسسة', 'المسؤول', 'الصفة', 'الهاتف', 'واتساب', 'البريد', 'المدينة', 'الدومين المطلوب', 'الباقة', 'المبلغ', 'الحالة', 'تاريخ الطلب'];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.schoolName.replace(/"/g, '""')}"`,
      `"${o.contactPerson.replace(/"/g, '""')}"`,
      `"${o.roleTitle}"`,
      o.phone,
      o.whatsapp,
      o.email,
      o.city,
      o.requestedDomain,
      o.selectedPackage,
      o.totalAmount,
      o.status,
      o.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `طلبات_المنظومة_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered schools
  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolsSearch.toLowerCase()) ||
      s.city.toLowerCase().includes(schoolsSearch.toLowerCase()) ||
      s.domainName.toLowerCase().includes(schoolsSearch.toLowerCase())
  );

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      ordersSearch === '' ||
      o.schoolName.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      o.contactPerson.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      o.city.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      o.requestedDomain.toLowerCase().includes(ordersSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#FBFBFA] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  لوحة تحكم المشرف العام للإدارة (Super Admin Portal)
                </h3>
                {isAuthenticated && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    جلسة نشطة ومؤمنة
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                إدارة المؤسسات الشريكة، الدومينات، وطلبات الشراء والاشتراكات الواردة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
              >
                تسجيل الخروج
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Discreet Platform Manager Authentication Screen */
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-right max-w-md mx-auto my-auto w-full">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 border border-slate-200">
              <Lock className="w-6 h-6" />
            </div>

            <h4 className="text-xl font-bold text-slate-900 mb-1 text-center">
              لوحة تحكم إدارة المنصة
            </h4>
            <p className="text-xs text-slate-500 mb-6 text-center">
              منطقة إدارية مخصصة لمدير المنصة لمتابعة الطلبات وتدبير المؤسسات الشريكة
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اسم المستخدم أو البريد:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden dir-ltr text-right font-mono"
                    placeholder="اسم المستخدم أو البريد الإلكتروني"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  كلمة المرور:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden dir-ltr text-right font-mono"
                    placeholder="••••••••"
                  />
                </div>
                {authError && <p className="text-[11px] text-rose-600 mt-1.5 font-bold">{authError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول للإدارة</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Dashboard Tabs Bar */}
            <div className="px-6 py-3 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'orders'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>طلبات الشراء والاشتراكات الواردة ({orders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('schools')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'schools'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>إدارة المؤسسات الشريكة ({schools.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'pricing'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>تعديل أثمنة العروض ({pricingPlans.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'stats'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>إحصائيات المنصة</span>
                </button>
                <button
                  onClick={() => setActiveTab('php_package')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'php_package'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  <span>حزمة PHP & MySQL (الكود المصدري)</span>
                </button>
              </div>

              {/* Action buttons per tab */}
              {activeTab === 'schools' && (
                <button
                  onClick={openAddSchool}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة مؤسسة شريكة جديدة</span>
                </button>
              )}

              {activeTab === 'pricing' && (
                <button
                  onClick={handleResetPrices}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  title="استعادة الأسعار الأصلية"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>استعادة الأسعار الأصلية</span>
                </button>
              )}

              {activeTab === 'orders' && (
                <button
                  onClick={handleExportOrdersCSV}
                  className="px-4 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>تصدير الطلبات (CSV Excel)</span>
                </button>
              )}
            </div>

            {/* Main Tab View */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* TAB 1: SCHOOLS MANAGEMENT */}
              {activeTab === 'schools' && (
                <div className="space-y-4">
                  {/* Search and counters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="ابحث بالاسم أو المدينة أو الدومين..."
                        value={schoolsSearch}
                        onChange={(e) => setSchoolsSearch(e.target.value)}
                        className="w-full pr-9 pl-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      إجمالي المؤسسات المعتمدة في الواجهة العامة: <strong className="text-slate-900 font-mono">{schools.length}</strong>
                    </div>
                  </div>

                  {/* Schools Table */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead className="bg-[#FBFBFA] border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="p-3.5">المؤسسة التعليمية</th>
                          <th className="p-3.5">المدينة والمديرية</th>
                          <th className="p-3.5">السلك</th>
                          <th className="p-3.5">الدومين المستقل</th>
                          <th className="p-3.5">التلاميذ / الحجرات</th>
                          <th className="p-3.5">الحالة</th>
                          <th className="p-3.5 text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredSchools.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 px-4 text-center">
                              <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                              <h5 className="text-sm font-bold text-slate-800 mb-1">
                                {schools.length === 0
                                  ? 'لا توجد مؤسسات تعليمية مضافة حالياً'
                                  : 'لا توجد نتائج مطابقة لبحثك'}
                              </h5>
                              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                                {schools.length === 0
                                  ? 'يمكنك إضافة المؤسسات الشريكة يدوياً لتظهر فوراً في واجهة الموقع ودليل المدارس.'
                                  : 'جرب البحث باسم آخر أو حذف نص البحث.'}
                              </p>
                              {schools.length === 0 ? (
                                <button
                                  onClick={openAddSchool}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>إضافة أول مؤسسة شريكة الآن</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => setSchoolsSearch('')}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all cursor-pointer"
                                >
                                  مسح البحث
                                </button>
                              )}
                            </td>
                          </tr>
                        ) : (
                          filteredSchools.map((school) => (
                            <tr key={school.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5 font-bold text-slate-900">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={school.logo}
                                    alt=""
                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900">{school.name}</div>
                                  <span className="text-[10px] text-slate-400 font-mono">{school.code}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 text-slate-600">
                              <div>{school.city}</div>
                              <span className="text-[10px] text-slate-400">{school.directorate}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-semibold text-emerald-800">{school.educationLevel}</span>
                            </td>
                            <td className="p-3.5 font-mono text-emerald-700 dir-ltr text-right">
                              {school.domainName}
                            </td>
                            <td className="p-3.5 text-slate-600 font-mono">
                              {school.studentsCount} تلميذ / {school.classroomsCount} قاعة
                            </td>
                            <td className="p-3.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {school.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => openEditSchool(school)}
                                  className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                                  title="تعديل بيانات المؤسسة"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`هل أنت متأكد من حذف مؤسسة "${school.name}"؟ سيتم تحديث الكتالوج فوراً.`)) {
                                      onDeleteSchool(school.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  title="حذف المؤسسة"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  
                  {/* Status filters and search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="ابحث برقم الطلب، المؤسسة، المسؤول، الدومين..."
                        value={ordersSearch}
                        onChange={(e) => setOrdersSearch(e.target.value)}
                        className="w-full pr-9 pl-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                      {(['all', 'new', 'in_progress', 'delivered', 'cancelled'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                            orderStatusFilter === st
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {st === 'all'
                            ? 'جميع الطلبات'
                            : st === 'new'
                            ? 'جديدة'
                            : st === 'in_progress'
                            ? 'قيد التنفيذ'
                            : st === 'delivered'
                            ? 'تم التسليم'
                            : 'ملغية'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead className="bg-[#FBFBFA] border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="p-3.5">رقم الطلب</th>
                          <th className="p-3.5">المؤسسة والمدينة</th>
                          <th className="p-3.5">المسؤول والاتصال</th>
                          <th className="p-3.5">الدومين المطلوب</th>
                          <th className="p-3.5">الباقة والمبلغ</th>
                          <th className="p-3.5">تغيير الحالة</th>
                          <th className="p-3.5 text-center">واتساب المباشر</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5 font-bold font-mono text-slate-900">
                              {ord.orderNumber}
                              <span className="text-[10px] text-slate-400 block font-normal">{ord.createdAt}</span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{ord.schoolName}</div>
                              <span className="text-[11px] text-slate-500">{ord.city}</span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-slate-800">{ord.contactPerson}</div>
                              <span className="text-[10px] text-slate-500 block">{ord.roleTitle}</span>
                              <span className="text-[11px] font-mono text-slate-600 dir-ltr text-right block">
                                {ord.phone}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-emerald-800 dir-ltr text-right font-medium">
                              {ord.requestedDomain}
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 block font-mono">{ord.totalAmount}</span>
                              <span className="text-[10px] text-slate-500">
                                {ord.selectedPackage === 'hosting_domain'
                                  ? 'استضافة + دومين'
                                  : ord.selectedPackage === 'php_standalone'
                                  ? 'نسخة مستقلة PHP'
                                  : 'دعم وتدريب شامل'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={ord.status}
                                onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                                className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border outline-hidden cursor-pointer ${
                                  ord.status === 'new'
                                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                                    : ord.status === 'in_progress'
                                    ? 'bg-blue-50 text-blue-900 border-blue-300'
                                    : ord.status === 'delivered'
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                    : 'bg-rose-50 text-rose-900 border-rose-300'
                                }`}
                              >
                                <option value="new">طلب جديد (قيد المعاينة)</option>
                                <option value="in_progress">قيد التثبيت والتنفيذ</option>
                                <option value="delivered">تم التسليم والتشغيل ✓</option>
                                <option value="cancelled">ملغي</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-center">
                              <a
                                href={`https://wa.me/212${ord.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
                                  `السلام عليكم أستاذ ${ord.contactPerson}، نتواصل معكم بخصوص طلبكم رقم ${ord.orderNumber} لمؤسسة ${ord.schoolName}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                <span>محادثة واتساب</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB: PRICING & OFFERS MANAGEMENT (تعديل أثمنة العروض) */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  {/* Live Feedback Toast */}
                  {saveSuccessMessage && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{saveSuccessMessage}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2.5 py-1 rounded-lg">
                        تم التحديث في واجهة الموقع ونموذج الطلب فوراً ✓
                      </span>
                    </div>
                  )}

                  {/* Top Director Pricing Control Banner */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-xs text-amber-300 font-bold">
                          لوحة التحكم في أسعار الاشتراكات والعروض التجارية
                        </span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black">
                        تعديل أثمنة وباقات العروض المعتمدة للمؤسسات التعليمية
                      </h4>
                      <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                        يمكنك هنا تغيير السعر المالي لكل باقة، العملة المعتمدة، نصوص الفوترة، الشارات التسويقية (مثل الأكثر طلباً)، ونصوص أزرار الطلب. بمجرد النقر على "حفظ التعديلات"، يتم تحديث الأسعار فوراً على واجهة الموقع الرئيسية وفي نموذج الطلبات والرسائل الموجهة عبر واتساب.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-stretch md:self-auto shrink-0">
                      <button
                        onClick={handleResetPrices}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                        <span>استعادة الأسعار الافتراضية (1200 / 2200 / 4000)</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Overview KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {pricingPlans.map((plan) => {
                      const draft = getDraft(plan);
                      return (
                        <div key={plan.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span className="font-bold text-slate-900">{plan.name}</span>
                            {draft.isPopular && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                الأكثر اختياراً
                              </span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                              {draft.price}
                            </span>
                            <span className="text-xs font-bold text-slate-700">{draft.currency}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-1 truncate">{draft.period}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Individual Package Editor Cards */}
                  <div className="space-y-6">
                    {pricingPlans.map((plan, planIdx) => {
                      const draft = getDraft(plan);

                      // Preset price suggestions
                      const pricePresets = 
                        plan.id === 'php_standalone' ? ['1,000', '1,200', '1,500', '1,800'] :
                        plan.id === 'hosting_domain' ? ['1,800', '2,000', '2,200', '2,500'] :
                        ['3,500', '4,000', '4,500', '5,000'];

                      return (
                        <div
                          key={plan.id}
                          className={`rounded-3xl p-6 bg-white border-2 transition-all shadow-xs ${
                            draft.isPopular
                              ? 'border-emerald-600 ring-2 ring-emerald-500/10'
                              : 'border-slate-200'
                          }`}
                        >
                          {/* Card Title & Meta Header */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                                planIdx === 0 ? 'bg-slate-800' : planIdx === 1 ? 'bg-emerald-600' : 'bg-teal-700'
                              }`}>
                                <Tag className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-black text-slate-900">{draft.name}</h4>
                                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                    ID: {plan.id}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500">
                                  السعر الحالي المعروض للزبائن: <strong className="text-emerald-800 font-mono">{draft.price} {draft.currency}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                <input
                                  type="checkbox"
                                  checked={draft.isPopular}
                                  onChange={(e) => updateDraft(plan.id, { isPopular: e.target.checked })}
                                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                                />
                                <span>تمييز كباقة مفضلة (أكثر طلباً)</span>
                              </label>

                              <button
                                onClick={() => handleSavePlan(plan)}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Save className="w-4 h-4" />
                                <span>حفظ تعديلات الباقة</span>
                              </button>
                            </div>
                          </div>

                          {/* Quick Price Presets Strip */}
                          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Coins className="w-4 h-4 text-amber-500" />
                              <span className="font-bold">أثمنة مقترحة وسريعة بنقرة واحدة:</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {pricePresets.map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => updateDraft(plan.id, { price: preset })}
                                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                                    draft.price === preset
                                      ? 'bg-emerald-700 text-white shadow-xs'
                                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                                  }`}
                                >
                                  {preset} {draft.currency}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Form Inputs Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            {/* Price */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                السعر (المبلغ المالي):
                              </label>
                              <input
                                type="text"
                                required
                                value={draft.price}
                                onChange={(e) => updateDraft(plan.id, { price: e.target.value })}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono font-black text-slate-900 text-sm"
                                placeholder="مثال: 1,200 أو 2,200"
                              />
                            </div>

                            {/* Currency */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                العملة:
                              </label>
                              <input
                                type="text"
                                required
                                value={draft.currency}
                                onChange={(e) => updateDraft(plan.id, { currency: e.target.value })}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-bold text-slate-800"
                                placeholder="درهم / MAD / EUR / USD"
                              />
                            </div>

                            {/* Badge */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                الشارة التسويقية (Badge):
                              </label>
                              <input
                                type="text"
                                value={draft.badge}
                                onChange={(e) => updateDraft(plan.id, { badge: e.target.value })}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                                placeholder="مثال: ترخيص دائم / الأكثر اختياراً"
                              />
                            </div>

                            {/* Plan Name */}
                            <div className="md:col-span-2">
                              <label className="font-bold text-slate-700 block mb-1">
                                اسم وعنوان الباقة:
                              </label>
                              <input
                                type="text"
                                required
                                value={draft.name}
                                onChange={(e) => updateDraft(plan.id, { name: e.target.value })}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-semibold"
                              />
                            </div>

                            {/* Billing Period Text */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                نص دورة الفوترة:
                              </label>
                              <input
                                type="text"
                                required
                                value={draft.period}
                                onChange={(e) => updateDraft(plan.id, { period: e.target.value })}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                                placeholder="مثال: سنوياً شامل الدومين / تدفع لمرة واحدة"
                              />
                            </div>

                            {/* CTA Button Label */}
                            <div className="md:col-span-2">
                              <label className="font-bold text-slate-700 block mb-1">
                                نص زر الطلب (CTA):
                              </label>
                              <input
                                type="text"
                                required
                                value={draft.ctaText}
                                onChange={(e) => updateDraft(plan.id, { ctaText: e.target.value })}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                              />
                            </div>

                            {/* Quick Save Action In-line */}
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => handleSavePlan(plan)}
                                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Save className="w-4 h-4 text-emerald-400" />
                                <span>تطبيق السعر ({draft.price} {draft.currency})</span>
                              </button>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-3">
                              <label className="font-bold text-slate-700 block mb-1">
                                الوصف الترويجي للباقة:
                              </label>
                              <textarea
                                rows={2}
                                value={draft.description}
                                onChange={(e) => updateDraft(plan.id, { description: e.target.value })}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
                              />
                            </div>

                            {/* Features list editor */}
                            <div className="md:col-span-3">
                              <label className="font-bold text-slate-700 block mb-1">
                                مزايا الباقة (اكتب كل ميزة في سطر منفصل):
                              </label>
                              <textarea
                                rows={4}
                                value={draft.featuresText}
                                onChange={(e) => updateDraft(plan.id, { featuresText: e.target.value })}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed font-sans text-xs"
                              />
                              <span className="text-[11px] text-slate-400 mt-1 block">
                                كل سطر يمثل نقطة ميزة بعلامة (✓) تظهر للمؤسسة في جدول الأسعار.
                              </span>
                            </div>
                          </div>

                          {/* Live Preview Box */}
                          <div className="mt-5 p-4 rounded-2xl bg-[#FBFBFA] border border-slate-200">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                              معاينة حية لشكل بطاقة السعر في الموقع العام:
                            </span>
                            <div className="max-w-md p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                              <div>
                                <span className="text-xs font-bold text-slate-900 block">{draft.name}</span>
                                <span className="text-[11px] text-slate-500">{draft.period}</span>
                              </div>
                              <div className="text-left font-mono">
                                <span className="text-2xl font-black text-emerald-800">{draft.price}</span>
                                <span className="text-xs font-bold text-slate-700 mr-1">{draft.currency}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: PLATFORM BUSINESS & PERFORMANCE STATISTICS */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  
                  {/* Top Director Overview Banner */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-bold">
                          بوابة إدارة منصة مدرستي الذكية (digiclasse.com)
                        </span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black">
                        لوحة مؤشرات الأداء والاشتراكات والمؤسسات الشريكة
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                        متابعة حية لكافة طلبات الشراء، حالة الدومينات الفرعية، وتدفق رسائل WhatsApp Cloud API الموجهة لأولياء الأمور عبر مختلف المدارس.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-stretch md:self-auto shrink-0">
                      <button
                        onClick={openAddSchool}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة مؤسسة جديدة</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/15"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>معالجة الطلبات ({orders.filter(o => o.status === 'new').length} جديدة)</span>
                      </button>
                    </div>
                  </div>

                  {/* Platform High-Level KPIs */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                      <span className="text-xs text-slate-500 font-medium block">إجمالي طلبات الشراء الواردة:</span>
                      <div className="text-3xl font-black text-slate-900 font-mono mt-1.5">{orders.length}</div>
                      <div className="flex items-center gap-2 mt-2 text-[11px]">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                          {orders.filter(o => o.status === 'new').length} جديدة
                        </span>
                        <span className="text-slate-400">تحتاج تأكيد</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                      <span className="text-xs text-slate-500 font-medium block">المؤسسات الشريكة المفعلة:</span>
                      <div className="text-3xl font-black text-emerald-700 font-mono mt-1.5">{schools.length}</div>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                        <span>{schools.filter(s => s.status === 'نشط').length} نطاقاً نشطاً على</span>
                        <span className="font-mono text-emerald-800 font-bold">.digiclasse.com</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                      <span className="text-xs text-slate-500 font-medium block">إجمالي رسائل واتساب المرسلة:</span>
                      <div className="text-3xl font-black text-teal-700 font-mono mt-1.5">480,240+</div>
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>نسبة تسليم وقراءة 99.4%</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                      <span className="text-xs text-slate-500 font-medium block">حالة WhatsApp Cloud API:</span>
                      <div className="text-2xl font-bold text-emerald-800 mt-2 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-ping" />
                        <span>متصل ويعمل</span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">خوادم ميتا السحابية الرسمية</span>
                    </div>
                  </div>

                  {/* Official Platform Contact & Direct Channels Card */}
                  <div className="p-5 rounded-2xl bg-[#FBFBFA] border border-slate-200/90">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      بيانات التواصل والطلبات المباشرة الرسمية المعتمدة للمنصة:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">واتساب المبيعات والدعم:</span>
                          <a
                            href="https://wa.me/212690976231"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs font-bold text-emerald-800 dir-ltr hover:underline"
                          >
                            +212 6 90 97 62 31
                          </a>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">البريد الإلكتروني المعتمد:</span>
                          <a
                            href="mailto:samirkoraji@gmail.com"
                            className="font-mono text-xs font-bold text-slate-900 dir-ltr hover:text-emerald-700"
                          >
                            samirkoraji@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">المقر الإداري:</span>
                          <span className="text-xs font-bold text-slate-900">الناضور - المملكة المغربية</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Simulation Monitor of System Operations in Partner Schools */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    <div className="p-4 bg-slate-100/80 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          محاكاة الأقسام النشطة في المدارس الشريكة (متابعة الحراسة العامة)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          نظام المراقبة اللحظية للغياب ورصد المقاعد المحدث عبر خوادم digiclasse.com
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">
                        تحديث مباشر ✓
                      </span>
                    </div>

                    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAFAF9]">
                      {[
                        { room: 'قاعة 01', class: 'الأولى باك علوم 1', school: 'ثانوية المسيرة', teacher: 'ذ. بناني', subject: 'الرياضيات', present: 32, absent: 1, status: 'نشطة' },
                        { room: 'قاعة 04', class: 'الثالثة إعدادي 2', school: 'إعدادية ابن بطوطة', teacher: 'ذ. التازي', subject: 'الفيزياء', present: 28, absent: 2, status: 'نشطة' },
                        { room: 'قاعة 07', class: 'الجذع المشترك علمي', school: 'مجموعة مدارس النخبة', teacher: 'ذة. الإدريسي', subject: 'علوم الحياة', present: 30, absent: 0, status: 'حضور تام' },
                        { room: 'قاعة 10', class: 'الثانية باك آداب', school: 'ثانوية الريف التأهيلية', teacher: 'ذ. العمراني', subject: 'الفلسفة', present: 27, absent: 3, status: 'نشطة' },
                        { room: 'قاعة 12', class: 'الثانية إعدادي 4', school: 'مؤسسة الفتح الخاصة', teacher: 'ذة. بنجلون', subject: 'اللغة الفرنسية', present: 31, absent: 1, status: 'نشطة' },
                        { room: 'مختبر 2', class: 'الأولى باك دولي', school: 'ثانوية ابن الهيثم', teacher: 'ذ. الصديقي', subject: 'الكيمياء', present: 29, absent: 0, status: 'حضور تام' },
                      ].map((c, i) => (
                        <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{c.room} · {c.class}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {c.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-medium mb-1">{c.school}</span>
                          <div className="text-[11px] text-slate-500 mb-2">
                            {c.subject} · {c.teacher}
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 font-mono">
                            <span className="text-emerald-700 font-bold">حاضرون: {c.present}</span>
                            <span className="text-rose-600 font-bold">غياب: {c.absent}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: PHP & MYSQL SOURCE CODE PACKAGE FOR CLIENT DELIVERY */}
              {activeTab === 'php_package' && (
                <div className="space-y-6">
                  {/* Top Intro Banner */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs text-emerald-400 font-bold">
                          حزمة الكود المصدري المستقل (Self-Host) - للتسليم والتركيب
                        </span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black">
                        حزمة PHP 8.2 & MySQL الخاصة بالمنظومة المدرسية
                      </h4>
                      <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                        هذه الحزمة البرمجية الكاملة جاهزة للتسليم للمؤسسات التعليمية التي تقتني باقة الـ 1,200 درهم للتثبيت الذاتي على سيرفراتها الخاصة، أو لنقل وتثبيت المنظومة على استضافات cPanel و VPS مع قاعدة بيانات MySQL وربط WhatsApp Cloud API.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-stretch md:self-auto shrink-0">
                      <button
                        onClick={() => {
                          const blob = new Blob([
                            `-- DigiClasse School System MySQL Schema\n` +
                            `CREATE DATABASE IF NOT EXISTS digiclasse_school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n` +
                            `USE digiclasse_school_db;\n\n` +
                            `CREATE TABLE settings (id INT AUTO_INCREMENT PRIMARY KEY, school_name VARCHAR(255), whatsapp_token TEXT, whatsapp_phone_number_id VARCHAR(100));\n` +
                            `CREATE TABLE classrooms (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), level VARCHAR(50), room_number VARCHAR(50), capacity INT DEFAULT 36);\n` +
                            `CREATE TABLE students (id INT AUTO_INCREMENT PRIMARY KEY, massar_code VARCHAR(20) UNIQUE, full_name VARCHAR(150), classroom_id INT, guardian_phone VARCHAR(30), guardian_whatsapp VARCHAR(30), seat_row INT, seat_col INT);\n` +
                            `CREATE TABLE attendances (id INT AUTO_INCREMENT PRIMARY KEY, student_id INT, date DATE, type ENUM('غياب_كامل', 'تأخر_بالدقائق'), delay_minutes INT DEFAULT 0, is_justified BOOLEAN DEFAULT FALSE, justification_reason TEXT);\n` +
                            `CREATE TABLE whatsapp_logs (id INT AUTO_INCREMENT PRIMARY KEY, student_id INT, recipient_phone VARCHAR(30), message_text TEXT, status VARCHAR(50) DEFAULT 'sent', sent_at DATETIME DEFAULT CURRENT_TIMESTAMP);\n`
                          ], { type: 'text/sql' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'database.sql';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>تحميل مخطط MySQL (database.sql)</span>
                      </button>
                    </div>
                  </div>

                  {/* Package Files Selector & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FBFBFA] border border-slate-200">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                      {[
                        { id: 'sql', label: 'قاعدة البيانات (database.sql)', icon: Database },
                        { id: 'config', label: 'الاتصال والإعدادات (config.php)', icon: Code2 },
                        { id: 'whatsapp', label: 'إرسال واتساب (whatsapp_api.php)', icon: MessageSquare },
                        { id: 'readme', label: 'دليل التثبيت (README.md)', icon: FileCode },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = selectedPhpFile === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedPhpFile(tab.id as any)}
                            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                              isSelected
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => {
                          let textToCopy = '';
                          let fname = '';
                          if (selectedPhpFile === 'sql') {
                            fname = 'database.sql';
                            textToCopy = `-- DigiClasse School Attendance & WhatsApp System\n-- MySQL 5.7+ / MariaDB 10.3+\nCREATE DATABASE IF NOT EXISTS \`digiclasse_school_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE \`digiclasse_school_db\`;\n\nCREATE TABLE \`settings\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`school_name\` VARCHAR(255) NOT NULL,\n  \`whatsapp_token\` TEXT,\n  \`whatsapp_phone_number_id\` VARCHAR(100)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE \`classrooms\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`name\` VARCHAR(100) NOT NULL,\n  \`level\` ENUM('ابتدائي', 'إعدادي', 'تأهيلي', 'مشترك') DEFAULT 'إعدادي',\n  \`room_number\` VARCHAR(50) DEFAULT 'القاعة 1',\n  \`capacity\` INT DEFAULT 36\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE \`students\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`massar_code\` VARCHAR(20) UNIQUE NOT NULL,\n  \`full_name\` VARCHAR(150) NOT NULL,\n  \`classroom_id\` INT NOT NULL,\n  \`guardian_phone\` VARCHAR(30) NOT NULL,\n  \`guardian_whatsapp\` VARCHAR(30) NOT NULL,\n  \`seat_row\` INT DEFAULT 1,\n  \`seat_col\` INT DEFAULT 1\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE \`attendances\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`student_id\` INT NOT NULL,\n  \`date\` DATE NOT NULL,\n  \`type\` ENUM('غياب_كامل', 'تأخر_بالدقائق') DEFAULT 'غياب_كامل',\n  \`delay_minutes\` INT DEFAULT 0,\n  \`is_justified\` BOOLEAN DEFAULT FALSE,\n  \`justification_reason\` TEXT\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE \`whatsapp_logs\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`student_id\` INT NOT NULL,\n  \`recipient_phone\` VARCHAR(30) NOT NULL,\n  \`message_text\` TEXT NOT NULL,\n  \`status\` VARCHAR(50) DEFAULT 'sent',\n  \`sent_at\` DATETIME DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
                          } else if (selectedPhpFile === 'config') {
                            fname = 'config.php';
                            textToCopy = `<?php\n// إعدادات الاتصال بقاعدة بيانات MySQL ومنظومة مدرستي الذكية\ndefine('DB_HOST', 'localhost');\ndefine('DB_NAME', 'digiclasse_school_db');\ndefine('DB_USER', 'root');\ndefine('DB_PASS', '');\ndefine('DB_CHARSET', 'utf8mb4');\n\n// WhatsApp Cloud API (Meta Developers)\ndefine('WHATSAPP_PHONE_NUMBER_ID', 'YOUR_PHONE_NUMBER_ID');\ndefine('WHATSAPP_ACCESS_TOKEN', 'YOUR_PERMANENT_ACCESS_TOKEN');\ndefine('WHATSAPP_API_URL', 'https://graph.facebook.com/v19.0/' . WHATSAPP_PHONE_NUMBER_ID . '/messages');\n\nfunction getDbConnection() {\n    static $pdo = null;\n    if ($pdo === null) {\n        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;\n        $pdo = new PDO($dsn, DB_USER, DB_PASS, [\n            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,\n            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC\n        ]);\n    }\n    return $pdo;\n}`;
                          } else if (selectedPhpFile === 'whatsapp') {
                            fname = 'whatsapp_api.php';
                            textToCopy = `<?php\nrequire_once __DIR__ . '/config.php';\n\nfunction sendAbsenceWhatsAppNotification($phone, $studentName, $type, $delayMinutes = 0) {\n    $msg = "السلام عليكم، إشعار من إدارة المؤسسة: التلميذ(ة) " . $studentName . " سجلت له حالة " . ($type === 'تأخر_بالدقائق' ? "تأخر بـ " . $delayMinutes . " دقيقة" : "غياب غير مبرر") . " بتاريخ اليوم.";\n    $payload = [\n        'messaging_product' => 'whatsapp',\n        'to' => $phone,\n        'type' => 'text',\n        'text' => ['body' => $msg]\n    ];\n    $ch = curl_init(WHATSAPP_API_URL);\n    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . WHATSAPP_ACCESS_TOKEN, 'Content-Type: application/json']);\n    curl_setopt($ch, CURLOPT_POST, true);\n    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));\n    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n    $res = curl_exec($ch);\n    curl_close($ch);\n    return json_decode($res, true);\n}`;
                          } else {
                            fname = 'README.md';
                            textToCopy = `# دليل تثبيت منظومة مدرستي الذكية (PHP 8.2 & MySQL)\n1. قم باستيراد ملف database.sql عبر phpMyAdmin في استضافتك.\n2. عدل بيانات الاتصال في config.php (اسم السيرفر، اسم القاعدة، اسم المستخدم، كلمة المرور).\n3. أضف مفتاح WhatsApp Cloud API المرسل في إعدادات config.php.\n4. افتح موقع المنظومة واستمتع برصد المقاعد وإرسال الإشعارات.`;
                          }

                          navigator.clipboard.writeText(textToCopy);
                          setCopiedFile(fname);
                          setTimeout(() => setCopiedFile(null), 2500);
                        }}
                        className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {copiedFile ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">تم نسخ الكود!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-500" />
                            <span>نسخ الكود بالكامل</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          let textToDownload = '';
                          let fname = '';
                          let mime = 'text/plain';
                          if (selectedPhpFile === 'sql') {
                            fname = 'database.sql';
                            mime = 'text/sql';
                            textToDownload = `-- DigiClasse School Attendance & WhatsApp System Schema\nCREATE DATABASE IF NOT EXISTS \`digiclasse_school_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE \`digiclasse_school_db\`;\n\nCREATE TABLE \`settings\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`school_name\` VARCHAR(255) NOT NULL,\n  \`whatsapp_token\` TEXT,\n  \`whatsapp_phone_number_id\` VARCHAR(100)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE \`classrooms\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`name\` VARCHAR(100) NOT NULL,\n  \`level\` ENUM('ابتدائي', 'إعدادي', 'تأهيلي', 'مشترك') DEFAULT 'إعدادي',\n  \`room_number\` VARCHAR(50) DEFAULT 'القاعة 1',\n  \`capacity\` INT DEFAULT 36\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE \`students\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`massar_code\` VARCHAR(20) UNIQUE NOT NULL,\n  \`full_name\` VARCHAR(150) NOT NULL,\n  \`classroom_id\` INT NOT NULL,\n  \`guardian_phone\` VARCHAR(30) NOT NULL,\n  \`guardian_whatsapp\` VARCHAR(30) NOT NULL,\n  \`seat_row\` INT DEFAULT 1,\n  \`seat_col\` INT DEFAULT 1\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE \`attendances\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`student_id\` INT NOT NULL,\n  \`date\` DATE NOT NULL,\n  \`type\` ENUM('غياب_كامل', 'تأخر_بالدقائق') DEFAULT 'غياب_كامل',\n  \`delay_minutes\` INT DEFAULT 0,\n  \`is_justified\` BOOLEAN DEFAULT FALSE,\n  \`justification_reason\` TEXT\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE \`whatsapp_logs\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n  \`student_id\` INT NOT NULL,\n  \`recipient_phone\` VARCHAR(30) NOT NULL,\n  \`message_text\` TEXT NOT NULL,\n  \`status\` VARCHAR(50) DEFAULT 'sent',\n  \`sent_at\` DATETIME DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
                          } else if (selectedPhpFile === 'config') {
                            fname = 'config.php';
                            mime = 'application/x-httpd-php';
                            textToDownload = `<?php\ndefine('DB_HOST', 'localhost');\ndefine('DB_NAME', 'digiclasse_school_db');\ndefine('DB_USER', 'root');\ndefine('DB_PASS', '');\ndefine('DB_CHARSET', 'utf8mb4');\n\ndefine('WHATSAPP_PHONE_NUMBER_ID', 'YOUR_PHONE_NUMBER_ID');\ndefine('WHATSAPP_ACCESS_TOKEN', 'YOUR_PERMANENT_ACCESS_TOKEN');\ndefine('WHATSAPP_API_URL', 'https://graph.facebook.com/v19.0/' . WHATSAPP_PHONE_NUMBER_ID . '/messages');\n\nfunction getDbConnection() {\n    static $pdo = null;\n    if ($pdo === null) {\n        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;\n        $pdo = new PDO($dsn, DB_USER, DB_PASS, [\n            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,\n            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC\n        ]);\n    }\n    return $pdo;\n}`;
                          } else if (selectedPhpFile === 'whatsapp') {
                            fname = 'whatsapp_api.php';
                            mime = 'application/x-httpd-php';
                            textToDownload = `<?php\nrequire_once __DIR__ . '/config.php';\n\nfunction sendAbsenceWhatsAppNotification($phone, $studentName, $type, $delayMinutes = 0) {\n    $msg = "السلام عليكم، إشعار من إدارة المؤسسة: التلميذ(ة) " . $studentName . " سجلت له حالة " . ($type === 'تأخر_بالدقائق' ? "تأخر بـ " . $delayMinutes . " دقيقة" : "غياب غير مبرر") . " بتاريخ اليوم.";\n    $payload = [\n        'messaging_product' => 'whatsapp',\n        'to' => $phone,\n        'type' => 'text',\n        'text' => ['body' => $msg]\n    ];\n    $ch = curl_init(WHATSAPP_API_URL);\n    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . WHATSAPP_ACCESS_TOKEN, 'Content-Type: application/json']);\n    curl_setopt($ch, CURLOPT_POST, true);\n    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));\n    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n    $res = curl_exec($ch);\n    curl_close($ch);\n    return json_decode($res, true);\n}`;
                          } else {
                            fname = 'README.md';
                            mime = 'text/markdown';
                            textToDownload = `# دليل تثبيت منظومة مدرستي الذكية (PHP 8.2 & MySQL)\n1. استيراد database.sql في phpMyAdmin.\n2. إعداد الاتصال في config.php.\n3. ربط WhatsApp Cloud API.\n4. المنظومة جاهزة للعمل.`;
                          }

                          const blob = new Blob([textToDownload], { type: mime });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = fname;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>تحميل الملف</span>
                      </button>
                    </div>
                  </div>

                  {/* Code Viewer Panel */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-lg dir-ltr text-left">
                    <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                        <span className="ml-2 text-slate-200 font-bold">
                          {selectedPhpFile === 'sql' && 'database.sql - MySQL 5.7/8.0 Schema'}
                          {selectedPhpFile === 'config' && 'config.php - Database & WhatsApp Config'}
                          {selectedPhpFile === 'whatsapp' && 'whatsapp_api.php - Meta WhatsApp Cloud API Sender'}
                          {selectedPhpFile === 'readme' && 'README.md - Requirements & Deployment Guide'}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {selectedPhpFile === 'sql' ? 'SQL / MySQL' : selectedPhpFile === 'readme' ? 'Markdown' : 'PHP 8.2+'}
                      </span>
                    </div>

                    <div className="p-4 overflow-x-auto max-h-96 text-xs font-mono leading-relaxed text-slate-300">
                      {selectedPhpFile === 'sql' && (
                        <pre className="text-emerald-300 whitespace-pre">
{`-- ========================================================
-- منظومة مدرستي الذكية - DigiClasse
-- مخطط قاعدة بيانات MySQL (جداول المقاعد، الغياب، وواتساب)
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`digiclasse_school_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`digiclasse_school_db\`;

-- 1. جدول إعدادات المؤسسة و WhatsApp Cloud API
CREATE TABLE IF NOT EXISTS \`settings\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`school_name\` VARCHAR(255) NOT NULL,
  \`whatsapp_token\` TEXT DEFAULT NULL,
  \`whatsapp_phone_number_id\` VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. جدول الأقسام والمستويات وتوزيع المقاعد
CREATE TABLE IF NOT EXISTS \`classrooms\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`level\` ENUM('ابتدائي', 'إعدادي', 'تأهيلي', 'مشترك') NOT NULL,
  \`room_number\` VARCHAR(50) DEFAULT 'القاعة 1',
  \`capacity\` INT DEFAULT 36,
  \`grid_rows\` INT DEFAULT 6,
  \`grid_cols\` INT DEFAULT 6
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. جدول التلاميذ ومقاعدهم وأرقام هواتف الأولياء
CREATE TABLE IF NOT EXISTS \`students\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`massar_code\` VARCHAR(20) NOT NULL UNIQUE,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`classroom_id\` INT NOT NULL,
  \`guardian_phone\` VARCHAR(30) NOT NULL,
  \`guardian_whatsapp\` VARCHAR(30) NOT NULL,
  \`seat_row\` INT DEFAULT 1,
  \`seat_col\` INT DEFAULT 1,
  FOREIGN KEY (\`classroom_id\`) REFERENCES \`classrooms\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. جدول تسجيل الغياب والتأخر بالدقائق
CREATE TABLE IF NOT EXISTS \`attendances\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`student_id\` INT NOT NULL,
  \`date\` DATE NOT NULL,
  \`type\` ENUM('غياب_كامل', 'تأخر_بالدقائق') NOT NULL,
  \`delay_minutes\` INT DEFAULT 0,
  \`is_justified\` BOOLEAN DEFAULT FALSE,
  \`justification_reason\` TEXT DEFAULT NULL,
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. جدول إشعارات واتساب السحابية
CREATE TABLE IF NOT EXISTS \`whatsapp_logs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`student_id\` INT NOT NULL,
  \`recipient_phone\` VARCHAR(30) NOT NULL,
  \`message_text\` TEXT NOT NULL,
  \`status\` VARCHAR(50) DEFAULT 'sent',
  \`sent_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`}
                        </pre>
                      )}

                      {selectedPhpFile === 'config' && (
                        <pre className="text-teal-300 whitespace-pre">
{`<?php
/**
 * منظومة مدرستي الذكية - ملف الاتصال بقاعدة البيانات MySQL
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'digiclasse_school_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

define('WHATSAPP_PHONE_NUMBER_ID', 'YOUR_PHONE_NUMBER_ID');
define('WHATSAPP_ACCESS_TOKEN', 'YOUR_PERMANENT_ACCESS_TOKEN');
define('WHATSAPP_API_URL', 'https://graph.facebook.com/v19.0/' . WHATSAPP_PHONE_NUMBER_ID . '/messages');

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    }
    return $pdo;
}`}
                        </pre>
                      )}

                      {selectedPhpFile === 'whatsapp' && (
                        <pre className="text-emerald-300 whitespace-pre">
{`<?php
/**
 * وحدة إرسال إشعارات واتساب السحابية عبر WhatsApp Cloud API (cURL)
 */

require_once __DIR__ . '/config.php';

function sendAbsenceWhatsAppNotification($phone, $studentName, $type, $delayMinutes = 0) {
    // تنظيف رقم الهاتف وإضافة رمز المغرب الدولي (212)
    $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
    if (str_starts_with($cleanPhone, '0')) {
        $cleanPhone = '212' . substr($cleanPhone, 1);
    }

    $msg = "السلام عليكم ورحمة الله،\\nإشعار من إدارة المؤسسة:\\nالتلميذ(ة): *" . $studentName . "*\\n";
    if ($type === 'تأخر_بالدقائق') {
        $msg .= "سُجل عليه تأخر بـ: *" . $delayMinutes . " دقيقة*\\n";
    } else {
        $msg .= "سُجلت عليه حالة: *غياب غير مبرر*\\n";
    }
    $msg .= "تاريخ الحصة: " . date('Y-m-d H:i');

    $payload = [
        'messaging_product' => 'whatsapp',
        'to' => $cleanPhone,
        'type' => 'text',
        'text' => ['body' => $msg]
    ];

    $ch = curl_init(WHATSAPP_API_URL);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . WHATSAPP_ACCESS_TOKEN,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}`}
                        </pre>
                      )}

                      {selectedPhpFile === 'readme' && (
                        <pre className="text-amber-200 whitespace-pre">
{`# خطوات التثبيت السريع على استضافة cPanel / Apache / Localhost

1. إنشاء قاعدة بيانات جديدة عبر cPanel MySQL Database Wizard.
2. الدخول إلى phpMyAdmin واستيراد ملف database.sql.
3. فتح ملف config.php وتحديث معلومات الاتصال:
   - DB_HOST (غالباً localhost)
   - DB_NAME (اسم قاعدة البيانات التي أنشأتها)
   - DB_USER & DB_PASS (اسم المستخدم وكلمة المرور)
4. إدخال مفتاح WhatsApp Cloud API المرسل في باقة الشراء.
5. فتح الرابط في المتصفح، والدخول بحساب المدير:
   - اسم المستخدم: admin
   - كلمة المرور: admin123`}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* School Add/Edit Form Modal */}
        {isSchoolFormOpen && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-right">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h4 className="text-base font-bold text-slate-900">
                  {editingSchool ? 'تعديل بيانات المؤسسة الشريكة' : 'إضافة مؤسسة تعليمية جديدة'}
                </h4>
                <button
                  onClick={() => setIsSchoolFormOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSchool} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المؤسسة التعليمية:</label>
                  <input
                    type="text"
                    required
                    value={schoolFormData.name}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">المدينة:</label>
                    <input
                      type="text"
                      required
                      value={schoolFormData.city}
                      onChange={(e) => setSchoolFormData({ ...schoolFormData, city: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">السلك التعليمي:</label>
                    <select
                      value={schoolFormData.educationLevel}
                      onChange={(e) => setSchoolFormData({ ...schoolFormData, educationLevel: e.target.value as EducationLevel })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    >
                      <option value="ابتدائي">ابتدائي</option>
                      <option value="إعدادي">إعدادي</option>
                      <option value="تأهيلي">تأهيلي</option>
                      <option value="مشترك">مشترك (مجموعة مدارس)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">المديرية الإقليمية:</label>
                  <input
                    type="text"
                    value={schoolFormData.directorate}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, directorate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">الموقع الفرعي (مثال: ecole.digiclasse.com):</label>
                    <input
                      type="text"
                      value={schoolFormData.domainName}
                      onChange={(e) => setSchoolFormData({ ...schoolFormData, domainName: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl dir-ltr text-right font-mono"
                      placeholder="nom-ecole.digiclasse.com"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">رابط الموقع الخارجي:</label>
                    <input
                      type="url"
                      value={schoolFormData.websiteUrl}
                      onChange={(e) => setSchoolFormData({ ...schoolFormData, websiteUrl: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl dir-ltr text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">عدد التلاميذ التقريبي:</label>
                    <input
                      type="number"
                      value={schoolFormData.studentsCount}
                      onChange={(e) => setSchoolFormData({ ...schoolFormData, studentsCount: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">عدد القاعات / الأقسام:</label>
                    <input
                      type="number"
                      value={schoolFormData.classroomsCount}
                      onChange={(e) => setSchoolFormData({ ...schoolFormData, classroomsCount: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSchoolFormOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    {editingSchool ? 'حفظ التعديلات' : 'إضافة المؤسسة للكتالوج'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
