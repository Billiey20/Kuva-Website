import React from 'react';
import { ShieldCheck } from 'lucide-react';

const typeColors = {
  National:  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  Private:   'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  Corporate: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
};

const insurancePartners = [
  { name: "SHA / NHIF",           type: "National",  logo: "🏛️" },
  { name: "CIC Insurance",        type: "Private",   logo: "🛡️" },
  { name: "Jubilee Insurance",    type: "Private",   logo: "🛡️" },
  { name: "Britam",               type: "Private",   logo: "🛡️" },
  { name: "APA Insurance",        type: "Private",   logo: "🛡️" },
  { name: "Madison Insurance",    type: "Private",   logo: "🛡️" },
  { name: "AON / Minet Kenya",    type: "Corporate", logo: "🏢" },
  { name: "Heritage Insurance",   type: "Private",   logo: "🛡️" },
  { name: "AAR Insurance",        type: "Private",   logo: "🛡️" },
  { name: "Resolution Insurance", type: "Private",   logo: "🛡️" },
];

export default function InsuranceIntegration() {
  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
              <ShieldCheck className="w-4 h-4" />
              Accepted Cover
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Accepted Insurance Providers</h2>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
            {Object.entries(typeColors).map(([type, cls]) => (
              <span key={type} className={`px-3 py-1 rounded-full border ${cls}`}>{type}</span>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {insurancePartners.map((partner, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/50 transition-all duration-200 px-4 py-4 flex flex-col items-center text-center gap-2 group"
            >
              <span className="text-2xl">{partner.logo}</span>
              <span className="font-bold text-slate-800 dark:text-white text-xs leading-snug group-hover:text-primary transition-colors">
                {partner.name}
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${typeColors[partner.type]}`}>
                {partner.type}
              </span>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          Please confirm your coverage with your insurer before your visit. Our billing desk is available to assist with pre-authorisation.
        </p>

      </div>
    </section>
  );
}
