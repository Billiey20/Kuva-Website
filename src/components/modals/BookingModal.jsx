import React, { useState, useEffect } from 'react';
import { X, CalendarCheck, AlertCircle, ChevronRight, ChevronLeft, Stethoscope, User, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const DEPARTMENTS = [
  { id: 'General Consultation', icon: Stethoscope, desc: 'Routine checkups and minor ailments' },
  { id: 'Pediatrics', icon: User, desc: 'Specialized care for children and infants' },
  { id: 'Maternity & OB/GYN', icon: User, desc: 'Women’s health and pregnancy care' },
  { id: 'Cardiology', icon: Stethoscope, desc: 'Heart and cardiovascular health' },
  { id: 'Orthopedics', icon: User, desc: 'Bone, joint, and muscle care' },
  { id: 'Neurology', icon: Stethoscope, desc: 'Brain and nervous system care' },
];

const MOCK_DOCTORS = {
  'General Consultation': [
    { id: 'dr-smith', name: 'Dr. John Smith', role: 'General Practitioner' },
    { id: 'dr-doe', name: 'Dr. Jane Doe', role: 'Family Medicine' }
  ],
  'Pediatrics': [
    { id: 'dr-sarah', name: 'Dr. Sarah Connor', role: 'Pediatrician' },
    { id: 'dr-brown', name: 'Dr. Emmet Brown', role: 'Pediatric Specialist' }
  ],
  'Maternity & OB/GYN': [
    { id: 'dr-emily', name: 'Dr. Emily Rose', role: 'Obstetrician' },
    { id: 'dr-michael', name: 'Dr. Michael Scott', role: 'Gynecologist' }
  ],
  'Cardiology': [
    { id: 'dr-house', name: 'Dr. Gregory House', role: 'Cardiologist' },
    { id: 'dr-wilson', name: 'Dr. James Wilson', role: 'Cardiothoracic Surgeon' }
  ],
  'Orthopedics': [
    { id: 'dr-bones', name: 'Dr. Temperance Brennan', role: 'Orthopedic Surgeon' }
  ],
  'Neurology': [
    { id: 'dr-shepherd', name: 'Dr. Derek Shepherd', role: 'Neurologist' }
  ]
};

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form states
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setStep(1);
      setIsSubmitted(false);
      setDepartment('');
      setDoctor('');
      setDate('');
      setTime('');
      setName('');
      setPhone('');
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
      // We might want to store doctor too, but schema might not have it yet.
      // appointment_date and time are standard.
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
        doctor_name: doctor, // store locally at least
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

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  // 1 = next, -1 = prev
  const [[page, direction], setPage] = useState([1, 0]);

  const paginate = (newDirection) => {
    const newPage = page + newDirection;
    setPage([newPage, newDirection]);
    setStep(newPage);
  };

  const isNextDisabled = () => {
    if (step === 1 && !department) return true;
    if (step === 2 && !doctor) return true;
    if (step === 3 && (!date || !time)) return true;
    if (step === 4 && (!name || !phone)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-background dark:bg-slate-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[600px]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary" />
              Book an Appointment
            </h3>
            {!isSubmitted && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={`h-1.5 w-8 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 relative overflow-hidden bg-white dark:bg-slate-900">
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Request Received!</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Our reception team at Webuye has received your details and will call you shortly to confirm your consultation slot with {doctor}.
              </p>
              
              {infoMessage && (
                <div className="mb-8 py-2.5 px-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-amber-800 dark:text-amber-400 rounded-xl text-xs font-medium inline-flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {infoMessage}
                </div>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="w-full max-w-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Close Window
              </button>
            </motion.div>
          ) : (
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 p-6 sm:p-8 overflow-y-auto"
              >
                {/* Step 1: Department */}
                {step === 1 && (
                  <div className="flex flex-col h-full">
                    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Select Department</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {DEPARTMENTS.map((dept) => {
                        const Icon = dept.icon;
                        const isSelected = department === dept.id;
                        return (
                          <button
                            key={dept.id}
                            onClick={() => setDepartment(dept.id)}
                            className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary' 
                                : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>{dept.id}</h5>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{dept.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Doctor */}
                {step === 2 && (
                  <div className="flex flex-col h-full">
                    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Select a Doctor</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Available doctors in {department}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {MOCK_DOCTORS[department]?.map((doc) => {
                        const isSelected = doctor === doc.name;
                        return (
                          <button
                            key={doc.id}
                            onClick={() => setDoctor(doc.name)}
                            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary' 
                                : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                              <User className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                              <h5 className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>{doc.name}</h5>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{doc.role}</p>
                            </div>
                          </button>
                        );
                      })}
                      {(!MOCK_DOCTORS[department] || MOCK_DOCTORS[department].length === 0) && (
                        <p className="text-sm text-slate-500">No doctors available for this department at the moment.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Date & Time */}
                {step === 3 && (
                  <div className="flex flex-col h-full">
                    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Choose Date & Time</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Select Date</label>
                        <input 
                          type="date" 
                          required 
                          value={date}
                          // Prevent selecting past dates (simple HTML5 min)
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 dark:text-white bg-white dark:bg-slate-800 text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Select Time</label>
                        <input 
                          type="time" 
                          required 
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 dark:text-white bg-white dark:bg-slate-800 text-sm" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Patient Details */}
                {step === 4 && (
                  <div className="flex flex-col h-full">
                    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Patient Details</h4>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 dark:text-white bg-white dark:bg-slate-800 text-sm" 
                          placeholder="e.g. Jane Doe" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          required 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 dark:text-white bg-white dark:bg-slate-800 text-sm" 
                          placeholder="+254 700 111 222" 
                        />
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <h6 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-3">Booking Summary</h6>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Doctor:</span>
                          <span className="font-semibold text-slate-800 dark:text-white">{doctor} ({department})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Date & Time:</span>
                          <span className="font-semibold text-slate-800 dark:text-white">{date} at {time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer Actions */}
        {!isSubmitted && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between items-center z-10">
            {step > 1 ? (
              <button 
                type="button"
                onClick={() => paginate(-1)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div> // Spacer
            )}

            {step < 4 ? (
              <button 
                type="button"
                onClick={() => paginate(1)}
                disabled={isNextDisabled()}
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-1.5 disabled:opacity-50 disabled:shadow-none"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleBookingSubmit}
                disabled={isNextDisabled() || isSubmitting}
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-1.5 disabled:opacity-50 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>Confirm Booking <CheckCircle className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
