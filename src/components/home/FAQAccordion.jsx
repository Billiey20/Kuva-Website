import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleQuestion, Plus, Minus } from 'lucide-react';

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
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="relative pt-12 pb-20 overflow-hidden bg-slate-50 dark:bg-slate-900/20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-40 -left-64 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-40 -right-64 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob [animation-delay:2000ms]"></div>

      <div className="container relative z-10 mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Find answers to common questions about our hospital services, insurance, and visiting hours.
          </motion.p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * (idx % 3) }}
                className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-white dark:bg-slate-900 border-primary/20 shadow-lg shadow-primary/5' 
                    : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md backdrop-blur-sm'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                >
                  <span className={`text-lg font-semibold transition-colors duration-300 pr-8 ${
                    isOpen ? 'text-primary' : 'text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-primary'
                  }`}>
                    {faq.question}
                  </span>
                  
                  <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    isOpen 
                      ? 'bg-primary text-white rotate-180' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
