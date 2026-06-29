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
              <span className="font-bold text-xl leading-tight">City Central Hospital</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground">
            <a href="#about" className="hover:text-primary transition-colors">About Us</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#staff" className="hover:text-primary transition-colors">Our Staff</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact Us</a>
          </nav>

          <div className="flex items-center gap-4">
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

      {/* Footer / Find Us */}
      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Find Us</h2>
            <p className="text-slate-400">Visit us, call us, or send us a message.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Phone */}
            <div className="flex flex-col items-center text-center">
              <Phone className="w-8 h-8 text-white mb-4" />
              <h4 className="font-semibold text-lg mb-1">Phone</h4>
              <a href="tel:+254700000000" className="text-slate-300 hover:text-white transition-colors">+254 700 000 000</a>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center text-center">
              <Mail className="w-8 h-8 text-white mb-4" />
              <h4 className="font-semibold text-lg mb-1">Email</h4>
              <a href="mailto:info@citycentral.com" className="text-slate-300 hover:text-white transition-colors">info@citycentral.com</a>
            </div>

            {/* Address */}
            <div className="flex flex-col items-center text-center">
              <MapPin className="w-8 h-8 text-white mb-4" />
              <h4 className="font-semibold text-lg mb-1">Address</h4>
              <p className="text-slate-300">123 Healing Avenue, Nairobi, Kenya</p>
            </div>
          </div>

          {/* Map Link */}
          <div className="flex justify-center mb-12">
            <a
              href="https://maps.google.com/?q=Nairobi,Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50"
            >
              <MapPin className="w-5 h-5" />
              Open in Google Maps
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              <span className="font-semibold text-white">City Central Hospital</span>
            </div>
            <p>&copy; {new Date().getFullYear()} City Central Hospital. All rights reserved.</p>
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
