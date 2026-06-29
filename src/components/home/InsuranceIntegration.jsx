import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function InsuranceIntegration() {
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
          <ShieldCheck className="w-16 h-16 text-accent mb-6" />
          <h3 className="text-3xl font-bold text-slate-800 mb-4">We Accept SHA</h3>
        </div>
      </div>
    </section>
  );
}
