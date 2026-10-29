export type EducationLevel = 'ابتدائي' | 'إعدادي' | 'تأهيلي' | 'مشترك';

export type SchoolStatus = 'نشط' | 'قيد الإطلاق' | 'مجدد';

export interface PartnerSchool {
  id: string;
  name: string;
  code: string;
  logo: string;
  city: string;
  directorate: string; // المديرية الإقليمية
  educationLevel: EducationLevel;
  joinDate: string;
  websiteUrl: string;
  domainName: string;
  studentsCount: number;
  classroomsCount: number;
  status: SchoolStatus;
  featured?: boolean;
}

export type OrderStatus = 'new' | 'in_progress' | 'delivered' | 'cancelled';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  schoolName: string;
  contactPerson: string;
  roleTitle: string; // مدير، حارس عام، ناظر، مسير
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  requestedDomain: string;
  selectedPackage: 'php_standalone' | 'hosting_domain' | 'custom_training';
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount: string;
}

export interface PricingPlan {
  id: 'php_standalone' | 'hosting_domain' | 'custom_training';
  name: string;
  badge?: string;
  price: string;
  currency: string;
  period: string;
  description: string;
  isPopular?: boolean;
  features: string[];
  specs: {
    hosting: string;
    domain: string;
    whatsappQuota: string;
    installation: string;
    support: string;
  };
  ctaText: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface DemoStudent {
  id: string;
  seatNumber: number;
  row: number;
  col: number;
  name: string;
  code: string;
  gender: 'male' | 'female';
  parentName: string;
  parentPhone: string;
  status: AttendanceStatus;
  lateMinutes?: number;
  excuseReason?: string;
  notes?: string;
  behaviorScore: number;
}

export interface WhatsAppNotification {
  id: string;
  studentName: string;
  parentPhone: string;
  type: 'غياب الحصة' | 'تأخر بالدقائق' | 'استدعاء فوري' | 'تقرير يومي';
  time: string;
  status: 'sent' | 'delivered' | 'read';
  message: string;
}

export interface PublicStatItem {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
}

export interface StatsSettings {
  isEnabled: boolean;
  items: PublicStatItem[];
}
