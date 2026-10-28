import React, { useState } from 'react';
import { PartnerSchool, EducationLevel } from '../types';
import { 
  Building, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Users, 
  Search, 
  GraduationCap, 
  CheckCircle2, 
  Globe,
  Sparkles
} from 'lucide-react';

interface PartnersCatalogProps {
  schools: PartnerSchool[];
  onSelectSchoolPreview: (school: PartnerSchool) => void;
  onOpenOrder: () => void;
}

export const PartnersCatalog: React.FC<PartnersCatalogProps> = ({
  schools,
  onSelectSchoolPreview,
  onOpenOrder,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique cities
  const cities = ['all', ...Array.from(new Set(schools.map((s) => s.city)))];

  const filteredSchools = schools.filter((school) => {
    const matchesCity = selectedCity === 'all' || school.city === selectedCity;
    const matchesLevel = selectedLevel === 'all' || school.educationLevel === selectedLevel;
    const matchesSearch =
      searchQuery.trim() === '' ||
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.directorate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.domainName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesLevel && matchesSearch;
  });

  return (
    <section id="partners" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-right">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wide mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>شبكة المؤسسات المعتمدة</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal">مواقع فرعية سحابية مستقلة (ecole.digiclasse.com)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              المؤسسات التعليمية والشراكات المعتمدة
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              تتمتع كل مؤسسة تعليمية بموقع فرعي مخصص فوري على منصة DigiClasse السحابية (مثل <span className="font-mono text-emerald-800 font-semibold dir-ltr">nom-ecole.digiclasse.com</span>)، مع استضافة آمنة وربط مباشر بالحراسة العامة وإشعارات واتساب.
            </p>
          </div>

          <button
            onClick={onOpenOrder}
            className="px-5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>طلب ربط مدرستك الآن</span>
          </button>
        </div>

        {/* When schools list is empty (waiting for manual additions by owner) */}
        {schools.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#FBFBFA] to-white border border-slate-200/80 text-center max-w-3xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              بوابة ربط المؤسسات التعليمية المستقلة
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-xl mx-auto">
              يتم إدراج واعتماد المؤسسات التعليمية وتفعيل مواقعها الفرعية الخاصة مباشرة. هل تدير مؤسسة تعليمية وترغب في الحصول على نطاقك المستقل وتفعيل خريطة المقاعد وإشعارات واتساب؟
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenOrder}
                className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>طلب المنظومة وحجز دومين مؤسستك</span>
              </button>
              <a
                href="https://wa.me/212690976231?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B1%D8%A8%D8%B7%20%D9%85%D8%A4%D8%B3%D8%B3%D8%AA%D9%86%D8%A7%20%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9%20%D8%A8%D9%85%D9%86%D8%B8%D9%88%D9%85%D8%A9%20%D9%85%D8%AF%D8%B1%D8%B3%D8%AA%D9%8A%20%D8%A7%D9%84%D8%B0%D9%83%D9%8A%D8%A9"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>تواصل مباشر مع الإدارة عبر واتساب</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-slate-200/80 mb-8 space-y-4">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ابحث باسم المؤسسة، المدينة، المديرية الإقليمية، أو الدومين..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>

                {/* Level Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 shrink-0">
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-2">السلك:</span>
                  {(['all', 'ابتدائي', 'إعدادي', 'تأهيلي', 'مشترك'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        selectedLevel === lvl
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {lvl === 'all' ? 'جميع الأسلاك' : lvl}
                    </button>
                  ))}
                </div>

              </div>

              {/* Cities Bar */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-200/60">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-2">المدينة:</span>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
                      selectedCity === city
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {city === 'all' ? 'كل المدن' : city}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
              <span>
                عرض <strong className="text-slate-800 font-mono">{filteredSchools.length}</strong> مؤسسة تعليمية
              </span>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('all');
                    setSelectedLevel('all');
                  }}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  إعادة تعيين الفلاتر
                </button>
              )}
            </div>

            {/* Schools Grid */}
            {filteredSchools.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-[#FBFBFA] border border-dashed border-slate-300">
                <Building className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 mb-1">لم يتم العثور على مؤسسات مطابقة للبحث</h4>
                <p className="text-xs text-slate-500 mb-4">جرب البحث باسم مدينة أخرى أو إزالة الفلترة الحالية.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('all');
                    setSelectedLevel('all');
                  }}
                  className="px-4 py-2 text-xs font-bold text-emerald-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  عرض جميع المؤسسات
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Top card metadata: level and status */}
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-4">
                        <span className="font-semibold text-emerald-800 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{school.educationLevel}</span>
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-[11px] font-mono text-slate-400">{school.code}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{school.status}</span>
                        </span>
                      </div>

                      {/* School Identity */}
                      <div className="flex items-start gap-3.5 mb-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center shadow-xs">
                          <img
                            src={school.logo}
                            alt={`شعار ${school.name}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                            {school.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{school.city} · {school.directorate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Operational stats */}
                      <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#FBFBFA] border border-slate-100 text-xs text-slate-600 mb-4">
                        <div>
                          <span className="text-slate-400 text-[11px] block">عدد التلاميذ:</span>
                          <strong className="text-slate-800 font-mono tabular-nums">{school.studentsCount.toLocaleString('ar-MA')} تلميذ</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">الأقسام والقاعات:</span>
                          <strong className="text-slate-800 font-mono tabular-nums">{school.classroomsCount} قاعة نشطة</strong>
                        </div>
                      </div>

                      {/* Domain & Join Date */}
                      <div className="space-y-1.5 text-xs text-slate-500 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Globe className="w-3.5 h-3.5 text-emerald-600" />
                            <span>الموقع الفرعي:</span>
                          </span>
                          <span className="font-mono text-emerald-700 font-semibold dir-ltr text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                            {school.domainName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>تاريخ الاعتماد:</span>
                          </span>
                          <span className="text-slate-600">{school.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Direct Action Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onSelectSchoolPreview(school)}
                        className="flex-1 py-2 px-3 text-xs font-bold text-slate-800 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>معاينة موقع المؤسسة المستقل</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};
