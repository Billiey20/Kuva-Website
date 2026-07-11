import React from 'react';
import { HeartPulse, Award, Users, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

const stats = [
  { value: '15+',  label: 'Years of Service',       icon: <Clock className="w-5 h-5" /> },
  { value: '50+',  label: 'Specialist Doctors',      icon: <Users className="w-5 h-5" /> },
  { value: '200+', label: 'Beds & Suites',           icon: <HeartPulse className="w-5 h-5" /> },
  { value: '98%',  label: 'Patient Satisfaction',    icon: <Award className="w-5 h-5" /> },
];

const pillars = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: 'Accredited & Trusted',
    desc: 'SHA/NHIF accredited and SafeCare certified, meeting the highest standards of clinical quality and patient safety in Western Kenya.'
  },
  {
    icon: <Users className="w-6 h-6 text-secondary" />,
    title: 'Expert Medical Team',
    desc: 'Our multidisciplinary team of over 50 specialist doctors, nurses, and allied health professionals delivers care with skill and compassion.'
  },
  {
    icon: <HeartPulse className="w-6 h-6 text-accent" />,
    title: 'Modern Facilities',
    desc: 'Equipped with state-of-the-art surgical theatres, a dedicated ICU, NICU, digital radiology suite, and modern diagnostic laboratories.'
  },
];

export default function AboutUs() {
  return (
    <section id="about" className="py-12 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text content */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
              <HeartPulse className="w-4 h-4" />
              About Kuva Hospital
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              Webuye's Leading<br className="hidden sm:block" />
              <span className="text-primary"> Healthcare Centre</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Kuva Hospital is a modern Level 4A referral hospital located along the Webuye-Malaba Highway in Bungoma County. For over 15 years, we have provided compassionate, high-quality medical care to the people of Webuye and the broader Western Kenya region.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Our hospital is equipped with advanced surgical theatres, a fully-staffed Intensive Care Unit, a Neonatal ICU, a modern diagnostic imaging suite, and comprehensive outpatient specialist clinics — all under one roof to ensure seamless, patient-centred care.
            </p>

            <a
              href="#services"
              className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:gap-3 transition-all"
            >
              Explore Our Services <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right — Pillars & Stats */}
          <div className="flex flex-col gap-6">

            {/* 3 pillars */}
            <div className="flex flex-col gap-3">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 hover:border-primary/20 hover:shadow-sm transition-all"
                >
                  <div className="mt-0.5 flex-shrink-0 bg-white rounded-lg p-2 shadow-sm border border-slate-100">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">{p.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-primary/5 border border-primary/10 rounded-xl px-3 py-4 text-center"
                >
                  <div className="text-primary mb-1 flex justify-center opacity-70">{s.icon}</div>
                  <div className="text-2xl font-black text-primary leading-none mb-1">{s.value}</div>
                  <div className="text-[10px] text-slate-500 font-semibold leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
