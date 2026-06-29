import React from 'react';
import { Ambulance, HeartPulse, Activity, Baby, Microscope } from 'lucide-react';

const services = [
  {
    title: "Accident & Emergency",
    desc: "24/7 dedicated trauma and emergency care units with rapid response teams.",
    icon: <Ambulance className="w-10 h-10 text-destructive" />
  },
  {
    title: "Inpatient & Outpatient Care",
    desc: "Comprehensive care wards and streamlined outpatient clinics.",
    icon: <HeartPulse className="w-10 h-10 text-primary" />
  },
  {
    title: "Surgical Theatre",
    desc: "Advanced operating rooms equipped for major and minor procedures.",
    icon: <Activity className="w-10 h-10 text-secondary" />
  },
  {
    title: "Maternity & Child Health",
    desc: "Dedicated wards for safe deliveries and pediatric specialized care.",
    icon: <Baby className="w-10 h-10 text-accent" />
  },
  {
    title: "Laboratory Services",
    desc: "Top level diagnostic laboratory and radiology imaging centers.",
    icon: <Microscope className="w-10 h-10 text-purple-600" />
  }
];

export default function ServicesGrid() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-6 inline-block group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{service.desc}</p>
              <a href="#staff" className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
