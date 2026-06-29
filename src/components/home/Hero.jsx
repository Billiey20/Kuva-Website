import React from 'react';
import { CalendarCheck, PhoneCall } from 'lucide-react';

export default function Hero() {
  return (
    <section id="about" className="relative w-full overflow-hidden bg-slate-900 min-h-[600px] flex items-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
          alt="Modern hospital lobby"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Comprehensive Care, <span className="text-secondary">Close to You.</span>
          </h1>

          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl">
            Experience the best care with our facilities and a compassionate team dedicated to your well-being.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-xl shadow-primary/20">
              <CalendarCheck className="h-5 w-5" />
              Book an Appointment
            </button>
            <a href="tel:+254700000000" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-xl">
              <PhoneCall className="h-5 w-5 text-primary" />
              +254 700 000 000
            </a>
          </div>
        </div>
      </div>

      {/* Curved bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-background rounded-t-[3rem] border-t border-slate-200"></div>
    </section>
  );
}
