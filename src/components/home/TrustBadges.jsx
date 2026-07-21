import React from 'react';
import { ShieldCheck, Heart, Award, FileText } from 'lucide-react';

const badges = [
  {
    title: "SHA / NHIF Accredited",
    desc: "Fully accredited by the Social Health Authority for outpatient, inpatient, and maternity services.",
    icon: <Heart className="w-8 h-8 text-accent" />,
    badgeText: "National Insurance"
  },
  {
    title: "SafeCare Quality Certified",
    desc: "Assessed and certified under SafeCare standards, validating our clinical safety protocols.",
    icon: <Award className="w-8 h-8 text-amber-500" />,
    badgeText: "Quality Level 4"
  },
  {
    title: "PPB Licensed Pharmacy",
    desc: "Pharmacy services fully licensed and regulated by the Pharmacy and Poisons Board of Kenya.",
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    badgeText: "Licensed Facility"
  },
  {
    title: "KMPDC Registered",
    desc: "Fully licensed as a Level 4A referral medical facility by the Kenya Medical Practitioners and Dentists Council.",
    icon: <FileText className="w-8 h-8 text-purple-600" />,
    badgeText: "Regulatory Approved"
  }
];

export default function TrustBadges() {
  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Accreditations & Quality Standards</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-secondary to-accent mx-auto rounded-full mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kuva Hospital maintains high clinical standards, certified by national regulatory bodies and international quality assessors.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {badges.map((badge, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl group-hover:scale-110 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-all duration-300">
                {badge.icon}
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-2 group-hover:text-primary transition-colors">{badge.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4">{badge.desc}</p>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                {badge.badgeText}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
