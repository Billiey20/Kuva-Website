import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hospital, Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has a profile or metadata role
      const user = data.user;
      const role = user?.user_metadata?.role || 'receptionist';
      
      sessionStorage.setItem('reception_user_email', user.email);
      sessionStorage.setItem('reception_user_role', role);
      sessionStorage.setItem('reception_auth_mode', 'online');
      
      navigate('/root');
    } catch (err) {
      console.warn('Supabase Auth failed:', err.message || err);
      
      // Check if they are trying the default demo credentials
      if (email === 'receptionist@kuvahospital.org' && password === 'password') {
        // Automatically allow access in offline mode
        handleDemoAccess();
      } else {
        setErrorMsg(err.message || 'Login failed. To access without credentials, type receptionist@kuvahospital.org and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    setIsDemoLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('reception_user_email', 'receptionist@kuvahospital.org');
      sessionStorage.setItem('reception_user_role', 'receptionist');
      sessionStorage.setItem('reception_auth_mode', 'offline');
      setIsDemoLoading(false);
      navigate('/root');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20 border border-primary-foreground/10">
            <Hospital className="w-9 h-9 text-accent" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Kuva Hospital
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Webuye Desk Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs flex items-start gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-800 transition-colors"
                  placeholder="receptionist@kuvahospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-800 transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-200 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-500 font-semibold">
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-bold text-primary hover:text-primary/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || isDemoLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/10 text-sm font-bold text-white bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 gap-2 items-center"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 text-accent" />
                    Sign in to Portal
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400 font-semibold tracking-wider uppercase">Or Test Online/Offline</span>
            </div>
          </div>

          {/* Demo Access Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={isLoading || isDemoLoading}
              className="w-full flex justify-center py-3 px-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-700 hover:text-slate-900 transition-all gap-2 items-center"
            >
              {isDemoLoading ? (
                <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
              ) : (
                'Access Demo Desk (No Login Required)'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
