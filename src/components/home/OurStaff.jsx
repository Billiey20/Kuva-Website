import React, { useState } from 'react';
import { Search, Calendar, Award } from 'lucide-react';

const specialties = ["All Departments", "General Consultation", "Maternity & OB/GYN", "Cardiology", "Pediatrics", "Orthopedics"];

const doctors = [
  {
    name: "Dr. Sarah Jenkins",
    department: "Maternity & OB/GYN",
    role: "Head of OB/GYN",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Over 15 years of experience in maternal and fetal medicine, high-risk pregnancy management, and gynecological surgeries.",
    schedule: "Mon, Wed, Fri (9:00 AM - 3:00 PM)",
    education: "MBChB, MMed (OB/GYN) - University of Nairobi"
  },
  {
    name: "Dr. Michael Chen",
    department: "Cardiology",
    role: "Chief Cardiologist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Specializes in interventional cardiology, coronary angioplasty, heart failure management, and preventive cardiovascular medicine.",
    schedule: "Tue, Thu (10:00 AM - 4:00 PM)",
    education: "MD, FACC - Harvard Medical School"
  },
  {
    name: "Dr. Emily Otieno",
    department: "Pediatrics",
    role: "Lead Pediatrician",
    image: "https://images.unsplash.com/photo-1594824432258-f6a133acdf07?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Dedicated to providing compassionate healthcare for infants, children, and adolescents. Expert in child developmental care and immunizations.",
    schedule: "Mon - Thu (8:00 AM - 2:00 PM)",
    education: "MBChB, MMed (Pediatrics) - Moi University"
  },
  {
    name: "Dr. David Kamau",
    department: "Orthopedics",
    role: "Orthopedic Surgeon",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Expert in joint replacement, sports injury reconstruction, arthroscopic surgery, and complex trauma management.",
    schedule: "Wed, Fri (9:00 AM - 4:00 PM)",
    education: "MBChB, FCS (Ortho) - COSECSA"
  }
];

export default function OurStaff() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.education.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All Departments' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <section id="staff" className="py-10 bg-slate-50 dark:bg-slate-900/20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-6 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Find a Doctor</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-secondary to-accent mx-auto rounded-full mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Search our directory of board-certified clinical specialists, general practitioners, and surgeons practicing at Kuva Hospital.
          </p>
        </div>

        {/* Directory Controls */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mb-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, education, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 outline-none transition-all"
            />
          </div>

          {/* Department Select Buttons */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none justify-start md:justify-end">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full md:w-56 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
            >
              {specialties.map((spec, idx) => (
                <option key={idx} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm">
              No doctors found matching your criteria. Try resetting filters or search query.
            </div>
          ) : (
            filteredDoctors.map((staff, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row group"
              >
                {/* Doctor Image */}
                <div className="w-full sm:w-44 h-48 sm:h-auto bg-slate-100 dark:bg-slate-700 flex-shrink-0 relative overflow-hidden">
                  <img
                    src={staff.image}
                    alt={staff.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                    {staff.department}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                      {staff.name}
                    </h3>
                    <p className="text-sm font-semibold text-secondary mb-3">{staff.role}</p>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                      {staff.bio}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-700 pt-3.5 mb-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        <Award className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{staff.education}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        <span>Consulting: {staff.schedule}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))}
                    className="w-full bg-slate-50 dark:bg-slate-900 hover:bg-primary dark:hover:bg-primary text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary text-xs font-bold py-2.5 rounded-xl transition-all duration-300"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
