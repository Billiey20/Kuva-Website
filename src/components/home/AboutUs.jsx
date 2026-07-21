import React from 'react';
import { HeartPulse, ShieldCheck, Users, Activity, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Accredited & Trusted',
    desc: 'SHA/NHIF accredited and SafeCare certified, meeting international clinical standards.',
    icon: <ShieldCheck className="w-5 h-5 text-primary" />
  },
  {
    title: 'Expert Medical Team',
    desc: 'Over 50 specialist doctors, highly-trained nurses, and skilled technologists.',
    icon: <Users className="w-5 h-5 text-secondary" />
  },
  {
    title: 'Modern Facilities',
    desc: 'State-of-the-art ICU, digital imaging, and advanced surgical theatres.',
    icon: <Activity className="w-5 h-5 text-accent" />
  }
];

export default function AboutUs() {
  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-[100px] opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Unified Split Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row"
        >
          
          {/* Left Side: Imagery & Badge */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto">
            {/* Main Image Filling the Container */}
            <img 
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=90&w=1600&h=1200" 
              alt="Modern Hospital Facility" 
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none"></div>

            {/* Floating Glassmorphism Badge */}
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:bottom-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 p-6 rounded-3xl shadow-xl flex items-center gap-4 max-w-[300px]">
              <div className="bg-primary/10 p-3 rounded-2xl flex-shrink-0">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">15+</div>
                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-tight">Years of Clinical Excellence</div>
              </div>
            </div>
          </div>

          {/* Right Side: Content Box */}
          <div className="w-full lg:w-1/2 p-10 md:p-14 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900 relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-6 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 self-start">
              <HeartPulse className="w-4 h-4" />
              About Kuva Hospital
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              Compassionate Care,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Advanced Medicine.</span>
            </h2>
            
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-10">
              Located along the Webuye-Malaba Highway, Kuva Hospital is a premier Level 4A referral centre. We blend state-of-the-art medical technology with deep, empathetic patient care to redefine healthcare standards across Western Kenya.
            </p>

            {/* Feature List */}
            <div className="space-y-6 mb-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 group cursor-default">
                  <div className="mt-1 bg-slate-50 dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-3 rounded-2xl group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:scale-105 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-slate-100 font-bold text-base mb-1">{feature.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Area */}
            <div className="flex items-center gap-4 pt-8 border-t border-slate-100 dark:border-slate-800 mt-auto">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&h=100&q=90" alt="Doctor" />
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-primary text-white flex items-center justify-center text-xs font-bold z-10">+50</div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Trusted by thousands</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
