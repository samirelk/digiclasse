import React, { useState } from 'react';
import { PartnerSchool, PurchaseOrder, OrderStatus, EducationLevel, SchoolStatus } from '../types';
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
  Sparkles
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: PartnerSchool[];
  orders: PurchaseOrder[];
  onAddSchool: (school: Omit<PartnerSchool, 'id'>) => void;
  onUpdateSchool: (school: PartnerSchool) => void;
  onDeleteSchool: (schoolId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  schools,
  orders,
  onAddSchool,
  onUpdateSchool,
  onDeleteSchool,
  onUpdateOrderStatus,
}) => {
  // Authentication State for platform manager
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab - default to orders for the platform owner
  const [activeTab, setActiveTab] = useState<'orders' | 'schools' | 'stats'>('orders');

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
