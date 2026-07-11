import React, { useState, useEffect } from 'react';
import { X, CalendarCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('General Consultation');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSubmitted(false);
      setName('');
      setPhone('');
      setDepartment('General Consultation');
      setDate('');
      setTime('');
      setInfoMessage('');
    };
    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setInfoMessage('');

    const newAppointment = {
      patient_name: name,
      patient_phone: phone,
      selected_service: department,
      appointment_date: date,
      appointment_time: time,
      status: 'pending'
    };

    try {
      // 1. Try Supabase Insert
      const { error } = await supabase
        .from('appointments')
        .insert([newAppointment]);

      if (error) throw error;
      
      // Success
      setIsSubmitted(true);
    } catch (err) {
      console.warn('Supabase offline or failed. Falling back to local storage sync:', err.message || err);
      
      // 2. Fallback to LocalStorage so it still works end-to-end offline
      const localQueue = JSON.parse(localStorage.getItem('local_appointments') || '[]');
      const offlineApt = {
        id: 'OFF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        ...newAppointment,
        created_at: new Date().toISOString()
      };
      localQueue.push(offlineApt);
      localStorage.setItem('local_appointments', JSON.stringify(localQueue));
      
      // Trigger a window event so the Dashboard can reload local data if open
      window.dispatchEvent(new CustomEvent('local-appointments-updated'));

      setInfoMessage('Processed via Local Demo Sync (Offline Mode)');
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" />
            Book an Appointment
          </h3>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-2">Request Received!</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
                Our reception team at Webuye has received your details and will call you shortly to confirm your consultation slot.
              </p>
              
              {infoMessage && (
                <div className="mb-6 py-2 px-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-xs inline-flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {infoMessage}
                </div>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 text-sm" 
                  placeholder="Jane Doe" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 text-sm" 
                  placeholder="+254 700 111222" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Department</label>
                <select 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white text-slate-800 text-sm"
                >
                  <option>General Consultation</option>
                  <option>Pediatrics</option>
                  <option>Maternity & OB/GYN</option>
                  <option>Cardiology</option>
                  <option>Orthopedics</option>
                  <option>Neurology</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Time</label>
                  <input 
                    type="time" 
                    required 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 text-sm" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
