import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsCounter } from './components/StatsCounter';
import { FeaturesSection } from './components/FeaturesSection';
import { PartnersCatalog } from './components/PartnersCatalog';
import { PricingSection } from './components/PricingSection';
import { OrderModal } from './components/OrderModal';
import { LiveDemoModal } from './components/LiveDemoModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SchoolPortalPreviewModal } from './components/SchoolPortalPreviewModal';
import { Footer } from './components/Footer';

import {
  INITIAL_PARTNER_SCHOOLS,
  INITIAL_PRICING_PLANS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_DEMO_STUDENTS,
} from './data/initialData';
import { PartnerSchool, PurchaseOrder, OrderStatus, PricingPlan } from './types';
import { MessageSquare, Sparkles, Shield, ArrowLeft } from 'lucide-react';

export default function App() {
  // Local storage keys
  const SCHOOLS_STORAGE_KEY = 'ecole_smart_partner_schools_v4';
  const ORDERS_STORAGE_KEY = 'ecole_smart_purchase_orders_v3';
  const PRICING_STORAGE_KEY = 'ecole_smart_pricing_plans_v2';

  // State: Partner Schools
  const [partnerSchools, setPartnerSchools] = useState<PartnerSchool[]>(() => {
    try {
      const saved = localStorage.getItem(SCHOOLS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved schools:', e);
    }
    return INITIAL_PARTNER_SCHOOLS;
  });

  // State: Purchase Orders
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved orders:', e);
    }
    return INITIAL_PURCHASE_ORDERS;
  });

  // State: Pricing Plans
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(() => {
    try {
      const saved = localStorage.getItem(PRICING_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved pricing plans:', e);
    }
    return INITIAL_PRICING_PLANS;
  });

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(SCHOOLS_STORAGE_KEY, JSON.stringify(partnerSchools));
    } catch (e) {
      console.error('Failed to save schools:', e);
    }
  }, [partnerSchools]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(purchaseOrders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }, [purchaseOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(pricingPlans));
    } catch (e) {
      console.error('Failed to save pricing plans:', e);
    }
  }, [pricingPlans]);

  // Modal visibility states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPackageForOrder, setSelectedPackageForOrder] = useState<
    'php_standalone' | 'hosting_domain' | 'custom_training'
  >('hosting_domain');

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedSchoolPreview, setSelectedSchoolPreview] = useState<PartnerSchool | null>(null);

  // Handlers for Orders
  const handleOpenOrder = (
    packageId: 'php_standalone' | 'hosting_domain' | 'custom_training' = 'hosting_domain'
  ) => {
    setSelectedPackageForOrder(packageId);
    setIsOrderModalOpen(true);
  };

  const handleSubmitOrder = (
    orderData: Omit<PurchaseOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>
  ): PurchaseOrder => {
    const newOrder: PurchaseOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `CMD-2025-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: 'اليوم، ' + new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      status: 'new',
    };

    setPurchaseOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  // Handlers for Partner Schools (CRUD)
  const handleAddSchool = (schoolData: Omit<PartnerSchool, 'id'>) => {
    const newSchool: PartnerSchool = {
      ...schoolData,
      id: `sch-${Date.now()}`,
    };
    setPartnerSchools((prev) => [newSchool, ...prev]);
  };

  const handleUpdateSchool = (updatedSchool: PartnerSchool) => {
    setPartnerSchools((prev) =>
      prev.map((sch) => (sch.id === updatedSchool.id ? updatedSchool : sch))
    );
  };

  const handleDeleteSchool = (schoolId: string) => {
    setPartnerSchools((prev) => prev.filter((sch) => sch.id !== schoolId));
  };

  // Handlers for Pricing Plans
  const handleUpdatePricingPlan = (updatedPlan: PricingPlan) => {
    setPricingPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
  };

  const handleResetPricingPlans = () => {
    setPricingPlans(INITIAL_PRICING_PLANS);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1E293B] flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Navbar (Strict 3-Zone Top Bar Contract) */}
      <Navbar
        onOpenOrder={() => handleOpenOrder('hosting_domain')}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      <main className="flex-1">
        
        {/* 2. Hero Section */}
        <HeroSection
          onOpenOrder={() => handleOpenOrder('hosting_domain')}
          onOpenDemo={() => setIsDemoModalOpen(true)}
        />

        {/* 3. Stats Counter Strip */}
        <StatsCounter />

        {/* 4. Features Bento Showcase */}
        <FeaturesSection
          onOpenDemo={() => setIsDemoModalOpen(true)}
          onOpenOrder={() => handleOpenOrder('hosting_domain')}
        />

        {/* 5. Partner Institutions Showcase & Directory */}
        <PartnersCatalog
          schools={partnerSchools}
          onSelectSchoolPreview={(school) => setSelectedSchoolPreview(school)}
          onOpenOrder={() => handleOpenOrder('hosting_domain')}
        />

        {/* 6. Pricing Packages */}
        <PricingSection
          plans={pricingPlans}
          onSelectPlan={(planId) => handleOpenOrder(planId)}
        />

        {/* 7. Bottom Director CTA Banner */}
        <section className="py-16 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-right">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>انطلاقة فورية لمؤسستك التعليمية</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug mb-2">
                  هل أنت مستعد لإنهاء مشاكل الغياب وضبط حجرات الدراسة رقمياً؟
                </h3>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  فريقنا التقني جاهز لتثبيت النظام، حجز دومين مؤسستك، وتدريب أطر الحراسة العامة في أقل من 24 ساعة.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => handleOpenOrder('hosting_domain')}
                  className="px-6 py-3.5 bg-white text-emerald-950 font-black text-sm rounded-xl shadow-lg hover:bg-emerald-50 transition-all cursor-pointer flex items-center gap-2 active:scale-98"
                >
                  <span>طلب النظام الآن لمدرستك</span>
                  <ArrowLeft className="w-4 h-4 text-emerald-800" />
                </button>
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="px-5 py-3.5 bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl border border-emerald-500/40 transition-all cursor-pointer"
                >
                  تجربة الديمو الحي
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 8. Quiet Footer */}
      <Footer
        onOpenOrder={() => handleOpenOrder('hosting_domain')}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Direct WhatsApp Quick Chat Widget for Sales & Support */}
      <aside aria-label="واتساب المبيعات والدعم" className="fixed bottom-6 left-6 z-40">
        <a
          href={`https://wa.me/212690976231?text=${encodeURIComponent(
            'السلام عليكم ورحمة الله، أود الاستفسار عن منظومة التدبير الذكي للأقسام والمقاعد والغياب عبر واتساب لمؤسستنا التعليمية.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all hover:scale-105 active:scale-95 border border-emerald-400/40"
          title="واتساب المبيعات والدعم المباشر: +212 6 90 97 62 31"
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <span className="text-[11px] text-emerald-100 font-medium">واتساب المبيعات والدعم</span>
            <span className="text-xs font-black font-mono dir-ltr">+212 6 90 97 62 31</span>
          </div>
        </a>
      </aside>

      {/* MODAL 1: Direct Purchase Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedPackageId={selectedPackageForOrder}
        plans={pricingPlans}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* MODAL 2: Interactive Live Demo Simulator */}
      <LiveDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        students={INITIAL_DEMO_STUDENTS}
        onOpenOrder={() => {
          setIsDemoModalOpen(false);
          handleOpenOrder('hosting_domain');
        }}
      />

      {/* MODAL 3: Admin & Supervisor Dashboard */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        schools={partnerSchools}
        orders={purchaseOrders}
        pricingPlans={pricingPlans}
        onAddSchool={handleAddSchool}
        onUpdateSchool={handleUpdateSchool}
        onDeleteSchool={handleDeleteSchool}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdatePricingPlan={handleUpdatePricingPlan}
        onResetPricingPlans={handleResetPricingPlans}
      />

      {/* MODAL 4: Branded School Portal Preview */}
      <SchoolPortalPreviewModal
        school={selectedSchoolPreview}
        onClose={() => setSelectedSchoolPreview(null)}
        onOpenOrder={() => {
          setSelectedSchoolPreview(null);
          handleOpenOrder('hosting_domain');
        }}
      />

    </div>
  );
}
