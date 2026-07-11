import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { HeartPulse, CalendarCheck, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import LiveChatWidget from '../chat/LiveChatWidget';
import BookingModal from '../modals/BookingModal';

export default function PatientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <HeartPulse className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-tight">Kuva Hospital</span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Webuye</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-primary transition-colors">About Us</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#staff" className="hover:text-primary transition-colors">Our Doctors</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
            <a href="#faqs" className="hover:text-primary transition-colors">FAQs</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+254700111222"
              className="hidden md:flex items-center gap-1.5 text-slate-600 hover:text-primary transition-colors text-sm font-semibold"
            >
              <Phone className="h-4 w-4 text-primary" />
              +254 700 111 222
            </a>
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 shadow-md transition-all hover:shadow-lg">
              <CalendarCheck className="h-4 w-4" />
              Book Appointment
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-slate-900 text-white">

        {/* Main Footer Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Column 1 — Branding */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <HeartPulse className="h-7 w-7 text-primary" />
                <div>
                  <p className="font-bold text-lg leading-tight">Kuva Hospital</p>
                  <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Webuye, Kenya</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-5">
                A modern Level 4A referral hospital committed to delivering exceptional, compassionate healthcare to the people of Webuye and the Western Kenya region.
              </p>
              <a href="https://wa.me/254700111222" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-green-400 hover:text-green-300 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full transition-colors">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Chat on WhatsApp
              </a>
            </div>

            {/* Column 2 — Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 border-b border-white/10 pb-2">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {[{label:'About Us',href:'#about'},{label:'Clinical Services',href:'#services'},{label:'Find a Doctor',href:'#staff'},{label:'Patient Stories',href:'#testimonials'},{label:'FAQs',href:'#faqs'},{label:'Contact Us',href:'#contact'}].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white transition-all inline-flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Services */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 border-b border-white/10 pb-2">Our Services</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {['Accident & Emergency','Surgical Theatre & ICU','Maternity & Child Health','Dental Services','Laboratory & Radiology','Inpatient & Outpatient'].map((svc) => (
                  <li key={svc}>
                    <a href="#services" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-secondary rounded-full flex-shrink-0"></span>
                      {svc}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Contact & Newsletter */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 border-b border-white/10 pb-2">Contact Us</h4>
              <ul className="space-y-3 text-sm text-slate-400 mb-6">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Along Webuye-Malaba Highway,<br/>Webuye, Bungoma County, Kenya</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href="tel:+254700111222" className="hover:text-white transition-colors">+254 700 111 222</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href="mailto:info@kuvahospital.org" className="hover:text-white transition-colors">info@kuvahospital.org</a>
                </li>
              </ul>
              <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">Health Newsletter</p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex gap-2">
                <input type="email" required placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary/50 transition-all" />
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
                  Join
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Kuva Hospital, Webuye. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://maps.google.com/?q=Webuye,Kenya" target="_blank" rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Google Maps
              </a>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-3 h-3 text-primary" /> SHA / NHIF Accredited
              </span>
            </div>
          </div>
        </div>

      </footer>

      {/* Floating Chat Widget */}
      <LiveChatWidget />

      {/* Booking Modal */}
      <BookingModal />
    </div>
  );
}
