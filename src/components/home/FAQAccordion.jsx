import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const faqs = [
  {
    question: "What are the operating hours at Kuva Hospital?",
    answer: "Our Accident & Emergency unit, ICU, laboratory, pharmacy, and inpatient wards operate 24 hours a day, 7 days a week. Specialist outpatient clinics run Monday to Saturday, 8:00 AM – 5:00 PM."
  },
  {
    question: "Does the hospital accept SHA (Social Health Authority)?",
    answer: "Yes. Kuva Hospital is fully accredited by the Social Health Authority (SHA/NHIF). We accept SHA cover for outpatient care, inpatient admissions, maternity deliveries, and surgical procedures."
  },
  {
    question: "How do I book an appointment with a specialist?",
    answer: "Click the 'Book Appointment' button on this website, select your preferred date and time. Our reception desk receives your request immediately and will call to confirm your slot."
  },
  {
    question: "Where is Kuva Hospital located in Webuye?",
    answer: "We are along the Webuye-Malaba Highway in Webuye Town, Bungoma County, Kenya. Find us instantly using the Google Maps link in our footer."
  },
  {
    question: "Do you have an ICU and operating theatres?",
    answer: "Yes — we have state-of-the-art major and minor operating theatres, a dedicated Intensive Care Unit (ICU), and a Neonatal ICU (NICU) for critical care cases."
  },
  {
    question: "What private insurance schemes do you accept?",
    answer: "We work with all major insurers including SHA, CIC, Jubilee, Britam, APA, Madison, AAR, and AON Minet/Minet Kenya. Please confirm coverage with your insurer before your visit."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="py-10 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
              <MessageCircleQuestion className="w-4 h-4" />
              Patient FAQs
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Frequently Asked<br className="hidden sm:block" /> Questions
            </h2>
          </div>
          <p className="text-slate-500 text-sm max-w-xs md:text-right leading-relaxed">
            Common questions from patients and families about our hospital services.
          </p>
        </div>

        {/* Two-column layout: questions left, answer right on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left — question list */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {faqs.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => setOpenIndex(idx)}
                className={`text-left px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  openIndex === idx
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                    : 'bg-slate-50 text-slate-700 border-slate-100 hover:border-primary/30 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold leading-snug">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${openIndex === idx ? 'rotate-180 text-white/70' : 'text-slate-400'}`} />
                </div>
              </button>
            ))}
          </div>

          {/* Right — answer panel */}
          <div className="lg:col-span-3">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 h-full min-h-[200px] flex flex-col justify-center">
              <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Q {String(openIndex + 1).padStart(2, '0')} of {String(faqs.length).padStart(2, '0')}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 leading-snug">
                {faqs[openIndex].question}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {faqs[openIndex].answer}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
