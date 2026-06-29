import React, { useState, useEffect } from 'react';
import { X, CalendarCheck } from 'lucide-react';

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSubmitted(false);
    };
    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" />
            Book an Appointment
          </h3>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="py-10 px-2">
              {/* Icon + Title on same line, slightly above center */}
              <div className="flex items-center gap-3 mb-8">
                <CalendarCheck className="w-7 h-7 text-green-500 flex-shrink-0" />
                <h4 className="text-xl font-bold text-slate-800">Request Received!</h4>
              </div>

              {/* Subtext with distance below the title */}
              <p className="text-slate-500 text-sm leading-relaxed mb-10 ml-10">
                Our reception team will call you shortly to confirm your time slot.
              </p>

              {/* Small close button, right-aligned */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-slate-100 text-slate-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="tel" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" placeholder="+254 700 000000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all">
                  <option>General Consultation</option>
                  <option>Pediatrics</option>
                  <option>Maternity & OB/GYN</option>
                  <option>Cardiology</option>
                  <option>Orthopedics</option>
                  <option>Neurology</option>
                </select>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg">
                  Confirm Booking
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
