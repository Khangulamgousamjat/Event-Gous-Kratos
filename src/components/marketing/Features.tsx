import React from 'react';

const coreValues = [
  { id: '01', title: 'Innovation', label: 'TECH', desc: 'Pushing the boundaries of what is possible through code and steel.' },
  { id: '02', title: 'Aggression', label: 'COMP', desc: 'Competing at the highest level of technical proficiency.' },
  { id: '03', title: 'Structure', label: 'DESIGN', desc: 'Architecting solutions with structural integrity and aesthetic clarity.' },
  { id: '04', title: 'Precision', label: 'CORE', desc: 'Focusing on the smallest details that define the largest systems.' },
];

const Features = () => {
  return (
    <section id="workshops" className="bg-surface-container-low py-10 md:py-16 border-y-2 border-on-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        {coreValues.map((val) => (
          <div key={val.id} className="flex flex-col gap-2">
            <span className="font-display font-bold text-primary">{val.id} / {val.label}</span>
            <h3 className="font-display font-bold text-2xl uppercase italic">{val.title}</h3>
            <p className="text-sm opacity-70">{val.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
