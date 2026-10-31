import React from 'react';
import { Star, ShieldCheck, CheckCircle, Building2, Quote } from 'lucide-react';

interface HospitalTestimonial {
  id: string;
  quote: string;
  author: string;
  initials: string;
  role: string;
  hospital: string;
  city: string;
  metric: string;
  gradient: string;
  badgeColor: string;
}

export const TestimonialsSection: React.FC = () => {
  const testimonials: HospitalTestimonial[] = [
    {
      id: 'apollo-indore',
      quote:
        'In a 3 AM acute postpartum emergency, our hospital was short of rare B-negative PRBC units. Instead of calling multiple blood banks for 45 minutes, we broadcasted on PulseRelay. City Care Hospital accepted within 2 minutes and our clinical teams coordinated direct peer handover immediately. It literally saved a mother’s life.',
      author: 'Dr. Vikramaditya Rathore',
      initials: 'VR',
      role: 'Chief Medical Superintendent & HOD Emergency',
      hospital: 'Apollo Super Speciality Hospital',
      city: 'Indore, MP',
      metric: 'B- Negative Emergency Saved',
      gradient: 'from-teal-600 to-emerald-700',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/50',
    },
    {
      id: 'citycare-indore',
      quote:
        'PulseRelay has completely redefined hospital-to-hospital mutual assistance. When our ICU was overwhelmed with trauma patients, nearby hospitals responded instantly to our emergency broadcast. Direct doctor-to-doctor phone coordination eliminated all administrative delays.',
      author: 'Dr. Sunita Deshmukh',
      initials: 'SD',
      role: 'Medical Director & Head of Surgery',
      hospital: 'City Care Multi-Speciality Hospital',
      city: 'Indore, MP',
      metric: 'Under 3 Min Peer Response',
      gradient: 'from-emerald-600 to-cyan-700',
      badgeColor: 'text-teal-700 bg-teal-50 border-teal-200/50',
    },
    {
      id: 'max-delhi',
      quote:
        'In critical blood banking, mutual cooperation between hospitals saves lives. PulseRelay provides transparent real-time inventory visibility across participating hospitals. When a peer hospital requests emergency blood, our officers accept with a single click and coordinate instant handover.',
      author: 'Dr. Rajesh K. Singhal',
      initials: 'RS',
      role: 'Director of Transfusion Medicine & Blood Centre',
      hospital: 'Max Super Speciality Hospital',
      city: 'Saket, New Delhi',
      metric: '100% Peer Aid Handover',
      gradient: 'from-cyan-600 to-teal-800',
      badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200/50',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-linear-to-b from-transparent via-[#e7f3f1]/50 to-transparent">
      {/* Decorative ambient spots */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-[#0d9488] text-[11px] font-black uppercase tracking-wider mb-3 shadow-xs">
            <Building2 className="w-3.5 h-3.5" />
            <span>Participating Hospital Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Trusted by Participating Hospitals
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
            Read how chief surgeons, emergency superintendents, and blood bank directors rely on PulseRelay for hospital-to-hospital emergency blood assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative bg-white/80 hover:bg-white backdrop-blur-md rounded-3xl p-8 border border-teal-900/10 hover:border-teal-500/30 shadow-sm hover:shadow-xl hover:shadow-teal-950/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Metric pill & Stars */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border ${t.badgeColor} flex items-center gap-1`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {t.metric}
                  </span>
                </div>

                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-teal-200/50 absolute -top-3 -left-2 -z-0 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal italic relative z-10">
                    "{t.quote}"
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center space-x-3.5">
                <div className="relative shrink-0">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-linear-to-br ${t.gradient} text-white font-black text-sm tracking-wider flex items-center justify-center shadow-md shadow-teal-900/15 ring-2 ring-teal-500/30 group-hover:ring-teal-500 transition-all`}
                  >
                    {t.initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white rounded-full p-0.5 shadow-sm ring-2 ring-white">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-teal-900 transition-colors truncate">
                    {t.author}
                  </h4>
                  <p className="text-[11px] text-teal-700 font-semibold truncate">{t.role}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {t.hospital} • {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
