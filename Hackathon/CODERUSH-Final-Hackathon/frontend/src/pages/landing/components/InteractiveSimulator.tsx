import React, { useState } from 'react';
import { BloodGroup, BloodComponent } from '../../../types';
import {
  Radio,
  Clock,
  Building2,
  MapPin,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const InteractiveSimulator: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('PRBC');
  const [unitsNeeded, setUnitsNeeded] = useState(3);
  const [acceptedHospitals, setAcceptedHospitals] = useState<string[]>([]);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components: BloodComponent[] = ['PRBC', 'Whole Blood', 'Platelets', 'FFP'];

  const simulatedOffers = [
    {
      id: 'hosp-1',
      name: 'AIIMS Central Hospital & Blood Centre',
      city: 'Ansari Nagar, New Delhi',
      distance: 2.4,
      transitMinutes: 12,
      availableUnits: 14,
      canSupply: 2,
    },
    {
      id: 'hosp-2',
      name: 'Safdarjung Regional Blood Centre',
      city: 'Ring Road, New Delhi',
      distance: 3.1,
      transitMinutes: 15,
      availableUnits: 9,
      canSupply: 1,
    },
    {
      id: 'hosp-3',
      name: 'Max Super Speciality Hospital',
      city: 'Saket, New Delhi',
      distance: 6.8,
      transitMinutes: 22,
      availableUnits: 5,
      canSupply: 1,
    },
  ];

  const handleGroupChange = (bg: BloodGroup) => {
    setSelectedGroup(bg);
    setAcceptedHospitals([]);
  };

  const handleComponentChange = (c: BloodComponent) => {
    setSelectedComponent(c);
    setAcceptedHospitals([]);
  };

  const handleUnitsChange = (num: number) => {
    setUnitsNeeded(num);
    setAcceptedHospitals([]);
  };

  const handleAcceptSimulated = (id: string) => {
    if (!acceptedHospitals.includes(id)) {
      setAcceptedHospitals([...acceptedHospitals, id]);
    }
  };

  return (
    <section id="simulator" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-[#0d9488] text-xs font-bold mb-3 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            <span>Interactive Live Grid Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Test the Inter-Hospital Lifeline
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
            Simulate a critical blood requirement and experience instant atomic locking across regional facilities.
          </p>
        </div>

        {/* Simulator Control Box with Frosted Glass */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 border border-teal-900/10 shadow-2xl shadow-teal-950/5 max-w-4xl mx-auto relative">
          
          {/* Blood Group Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-black">1</span>
                Target Blood Group
              </label>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/50">
                Selected: {selectedGroup}
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => handleGroupChange(bg)}
                  className={`py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    selectedGroup === bg
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-700/25 scale-[1.03] ring-2 ring-teal-400'
                      : 'bg-white hover:bg-teal-50 text-slate-700 border border-slate-200/80 hover:border-teal-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Component & Units Selector */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-black">2</span>
                Component Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {components.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleComponentChange(c)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      selectedComponent === c
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-black">3</span>
                Emergency Units Needed
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleUnitsChange(num)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      unitsNeeded === num
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {num} U
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50"></span>
                Live Responses: {unitsNeeded} Units of {selectedGroup} ({selectedComponent})
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-[11px] text-teal-700 font-extrabold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                  {acceptedHospitals.length} of {simulatedOffers.length} Locked
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {simulatedOffers.map((offer) => {
                const isAccepted = acceptedHospitals.includes(offer.id);
                return (
                  <div
                    key={offer.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isAccepted
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                        isAccepted ? 'bg-emerald-600 text-white' : 'bg-teal-50 text-teal-700 border border-teal-100'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{offer.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-teal-600" />
                          {offer.city} • <span className="text-slate-700 font-semibold">{offer.distance} km away</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-black text-slate-900 block">
                          Can Supply <span className="text-teal-700">{offer.canSupply} Units</span>
                        </span>
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 sm:justify-end">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          {offer.transitMinutes} mins transit
                        </span>
                      </div>

                      <button
                        onClick={() => handleAcceptSimulated(offer.id)}
                        disabled={isAccepted}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                          isAccepted
                            ? 'bg-emerald-600 text-white shadow-xs cursor-default'
                            : 'bg-slate-900 hover:bg-teal-600 text-white shadow-xs hover:shadow-teal-700/20'
                        }`}
                      >
                        {isAccepted ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Unit Reserved</span>
                          </>
                        ) : (
                          <span>Accept & Lock</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom info hint */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Simulated broadcast connects to <strong>25+ verified hospitals</strong> across Delhi NCR with zero double-reservations.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
