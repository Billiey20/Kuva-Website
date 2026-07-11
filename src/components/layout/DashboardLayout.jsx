import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { HeartPulse, Settings, LogOut, ChevronDown, User } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/root/login';
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm flex-shrink-0 z-40">
        {/* Logo — same as patient side */}
        <Link to="/" className="flex items-center gap-2 text-primary">
          <HeartPulse className="h-8 w-8 text-primary" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg text-slate-800">Kuva Hospital</span>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase text-primary">Webuye Desk</span>
          </div>
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              JD
            </div>
            <span className="text-sm font-medium text-slate-700">Jane Doe</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-slate-800">Jane Doe</p>
              </div>
              <Link
                to="/root"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                to="/root"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <div className="border-t border-slate-100">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
