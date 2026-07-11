import React, { useState } from 'react';
import { Ambulance, HeartPulse, Activity, Baby, Microscope, X, Clock, ShieldCheck, CalendarRange } from 'lucide-react';

const services = [
  {
    title: "Accident & Emergency",
    desc: "24/7 dedicated trauma and emergency care units with rapid response teams.",
    icon: <Ambulance className="w-10 h-10 text-destructive" />,
    hours: "24 Hours, 7 Days a week",
    subServices: [
      "24/7 Trauma Care & Resuscitation Wards",
      "Fully Equipped Ambulances with Paramedics",
      "Triage & Rapid Assessment Clinic",
      "Disaster Management Services"
    ],
    detailedDesc: "Our Accident and Emergency department is Webuye's premier trauma centre. We provide critical stabilization, trauma care, and acute medical treatment 24/7. Our doctors, nurses, and emergency physicians are trained in Advanced Cardiac Life Support (ACLS) and Advanced Trauma Life Support (ATLS)."
  },
  {
    title: "Inpatient & Outpatient Care",
    desc: "Comprehensive general wards, VIP private suites, and streamlined outpatient specialist clinics.",
    icon: <HeartPulse className="w-10 h-10 text-primary" />,
    hours: "Outpatient: Mon-Sat 8AM - 5PM | Inpatient: 24/7",
    subServices: [
      "General Outpatient Consultations",
      "Executive & General Wards",
      "VIP Private Rooms",
      "Specialty Clinics (Diabetes, Hypertension, Chest Clinic)"
    ],
    detailedDesc: "Kuva Hospital features modern inpatient wards designed for patient comfort and healing. Our outpatient clinics provide general consultations and chronic disease management clinics staffed by resident physicians and consulting specialists."
  },
  {
    title: "Surgical Theatre & ICU",
    desc: "Advanced operating rooms and intensive care units equipped for major and minor procedures.",
    icon: <Activity className="w-10 h-10 text-secondary" />,
    hours: "Elective: Mon-Fri 8AM - 5PM | Emergency: 24/7",
    subServices: [
      "Laparoscopic (Keyhole) Surgeries",
      "General, Orthopedic & Gynae Surgeries",
      "Intensive Care Unit (ICU)",
      "High Dependency Unit (HDU)"
    ],
    detailedDesc: "Our ultra-modern theatre contains advanced surgical towers, anaesthetic monitors, and infection-control venting systems. Backed by our 24/7 ICU, we support major neuro, orthopedic, gastro, and obstetric surgeries."
  },
  {
    title: "Maternity & Child Health",
    desc: "Dedicated delivery rooms, neonatal intensive care units (NICU), and pediatric specialist care.",
    icon: <Baby className="w-10 h-10 text-accent" />,
    hours: "Deliveries: 24/7 | Pediatric Clinic: Daily 8AM - 5PM",
    subServices: [
      "Normal & Caesarean Deliveries",
      "Antenatal & Postnatal Clinics",
      "Neonatal Intensive Care Unit (NICU)",
      "Well-Baby Immunization & Child Welfare"
    ],
    detailedDesc: "We provide a safe, warm, and comforting environment for new mothers and babies. Our maternity team supports pain-free deliveries, prenatal instruction, and is backed by Bungoma County's premier NICU incubator units."
  },
  {
    title: "Laboratory & Radiology Services",
    desc: "Highly accredited diagnostic laboratory and digital radiology imaging centers.",
    icon: <Microscope className="w-10 h-10 text-purple-600" />,
    hours: "24 Hours, 7 Days a week",
    subServices: [
      "Hematology, Biochemistry & Microbiology",
      "Digital X-Ray & Ultrasound Imaging",
      "Multi-slice CT Scanning",
      "Routine Corporate Pre-employment Screening"
    ],
    detailedDesc: "Equipped with state-of-the-art biochemistry analyzers and diagnostic imaging machines, our diagnostic department delivers fast, highly accurate, and validated lab and scan results for clinics and external referrals."
  }
];

export default function ServicesGrid() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <section id="services" className="py-10 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Title */}
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Clinical Services</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-secondary to-accent mx-auto rounded-full mb-4"></div>
          <p className="text-slate-500 text-sm">
            Kuva Hospital offers a wide array of specialized clinical, surgical, and diagnostic services to patients across the region.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-block group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{service.desc}</p>
              </div>
              
              <button
                onClick={() => setSelectedService(service)}
                className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all self-start text-left focus:outline-none"
              >
                Learn details <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2.5">
                {selectedService.icon}
                {selectedService.title}
              </h3>
              <button 
                onClick={() => setSelectedService(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Service Overview</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{selectedService.detailedDesc}</p>
              </div>

              {/* Operating hours */}
              <div className="flex items-start gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-0.5">Hours of Service</h4>
                  <p className="text-xs text-slate-500 font-semibold">{selectedService.hours}</p>
                </div>
              </div>

              {/* Sub-services list */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Core Specialty Capabilities</h4>
                <ul className="grid grid-cols-1 gap-2 text-xs font-semibold text-slate-600">
                  {selectedService.subServices.map((sub, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3 flex-shrink-0">
              <button
                onClick={() => { setSelectedService(null); window.dispatchEvent(new CustomEvent('open-booking-modal')); }}
                className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-bold hover:bg-primary/95 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <CalendarRange className="w-4 h-4 text-accent" />
                Book Consultation
              </button>
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
