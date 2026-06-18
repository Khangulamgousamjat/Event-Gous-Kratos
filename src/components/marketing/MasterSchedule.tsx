import React from 'react';

const scheduleData = [
  {
    time: "9:00 AM \u2013 10:00 AM",
    day1: "Registration + Inauguration",
    day2: "Briefing + Late Registration",
    isBreak: false
  },
  {
    time: "10:00 AM \u2013 1:00 PM",
    day1: "Round 1 of all events (Prelims)",
    day2: "Finals of selected events",
    isBreak: false
  },
  {
    time: "1:00 PM \u2013 2:00 PM",
    day1: "Lunch Break",
    day2: "Lunch Break",
    isBreak: true
  },
  {
    time: "2:00 PM \u2013 5:30 PM",
    day1: "Round 2 / Branch events / Common events",
    day2: "Finals, Project Expo, Demos",
    isBreak: false
  },
  {
    time: "5:30 PM \u2013 6:00 PM",
    day1: "Day 1 wrap-up",
    day2: "Prize Distribution + Closing Ceremony",
    isBreak: false
  }
];

export default function MasterSchedule() {
  return (
    <section id="schedule" className="py-24 bg-surface-container-low">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-5xl font-black uppercase italic mb-4">Official Itinerary</h2>
          <div className="h-1 w-32 bg-primary-container"></div>
          <p className="mt-6 font-sans font-bold opacity-60 max-w-2xl">
            The definitive 2-Day structural timeline for Kratos 2026. All operatives must strictly adhere to the scheduled time bounds.
          </p>
        </div>

        {/* Desktop View (Table Format) */}
        <div className="hidden lg:block brutal-border bg-surface overflow-hidden hard-shadow-gold">
          {/* Header Row */}
          <div className="grid grid-cols-12 border-b-4 border-on-surface bg-primary text-on-primary">
            <div className="col-span-2 p-6 border-r-4 border-on-surface font-display font-black text-xl uppercase tracking-widest flex items-center justify-center">
              Time Slot
            </div>
            <div className="col-span-5 p-6 border-r-4 border-on-surface font-display font-black text-2xl uppercase tracking-widest flex flex-col items-center justify-center">
              <span>Day 1</span>
              <span className="text-sm tracking-widest opacity-80 mt-1">&mdash; Ignition &mdash;</span>
            </div>
            <div className="col-span-5 p-6 font-display font-black text-2xl uppercase tracking-widest flex flex-col items-center justify-center">
              <span>Day 2</span>
              <span className="text-sm tracking-widest opacity-80 mt-1">&mdash; Surge &mdash;</span>
            </div>
          </div>

          {/* Body Rows */}
          {scheduleData.map((row, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-12 border-b-2 last:border-b-0 border-on-surface hover:bg-surface-container-low transition-colors ${row.isBreak ? 'bg-secondary-container/30' : ''}`}
            >
              <div className="col-span-2 p-6 border-r-2 border-on-surface font-display font-bold text-lg flex items-center justify-center text-center">
                {row.time}
              </div>
              
              {row.isBreak ? (
                <div className="col-span-10 p-6 font-display font-black text-xl uppercase tracking-[0.2em] text-center flex items-center justify-center opacity-60 italic">
                  &lt; Lunch Break &gt;
                </div>
              ) : (
                <>
                  <div className="col-span-5 p-6 border-r-2 border-on-surface font-sans font-medium text-lg flex items-center justify-center text-center">
                    {row.day1}
                  </div>
                  <div className="col-span-5 p-6 font-sans font-medium text-lg flex items-center justify-center text-center">
                    {row.day2}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Mobile View (Stack Format) */}
        <div className="lg:hidden space-y-12">
          {/* Day 1 Mobile */}
          <div className="brutal-border bg-surface hard-shadow">
            <div className="bg-primary text-on-primary p-6 border-b-4 border-on-surface text-center">
              <h3 className="font-display font-black text-3xl uppercase tracking-tighter">Day 1</h3>
              <p className="tracking-widest opacity-80 italic">&mdash; Ignition &mdash;</p>
            </div>
            <div className="divide-y-2 divide-on-surface">
              {scheduleData.map((row, idx) => (
                <div key={`d1-${idx}`} className={`p-6 ${row.isBreak ? 'bg-secondary-container/30' : ''}`}>
                  <p className="font-display font-bold text-sm text-primary mb-2 tracking-widest">{row.time}</p>
                  <p className={`font-sans ${row.isBreak ? 'font-black uppercase italic opacity-60' : 'font-medium text-lg'}`}>
                    {row.day1}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Day 2 Mobile */}
          <div className="brutal-border bg-surface hard-shadow-gold">
            <div className="bg-primary text-on-primary p-6 border-b-4 border-on-surface text-center">
              <h3 className="font-display font-black text-3xl uppercase tracking-tighter">Day 2</h3>
              <p className="tracking-widest opacity-80 italic">&mdash; Surge &mdash;</p>
            </div>
            <div className="divide-y-2 divide-on-surface">
              {scheduleData.map((row, idx) => (
                <div key={`d2-${idx}`} className={`p-6 ${row.isBreak ? 'bg-secondary-container/30' : ''}`}>
                  <p className="font-display font-bold text-sm text-primary mb-2 tracking-widest">{row.time}</p>
                  <p className={`font-sans ${row.isBreak ? 'font-black uppercase italic opacity-60' : 'font-medium text-lg'}`}>
                    {row.day2}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
