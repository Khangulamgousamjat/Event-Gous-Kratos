import React from 'react';

export const metadata = {
  title: 'Sponsorships | Kratos 2026',
};

export default function SponsorshipsPage() {
  return (
    <main className="min-h-screen bg-surface selection:bg-primary selection:text-on-primary font-sans">
      <div className="pt-12 pb-24 px-6 max-w-[1440px] mx-auto w-full">
        <div className="mb-16 text-center">
          <span className="text-sm font-display font-bold uppercase tracking-widest text-primary mb-2 block">Corporate Integration</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">Sponsor The Future</h1>
          <p className="text-xl opacity-70 max-w-3xl mx-auto font-sans">
            Align your brand with KRATOS 2026 and connect with upcoming engineers through festival visibility, engagement, and event partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 brutal-border overflow-hidden mb-16">
          <div className="p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-on-surface hover:bg-primary-container group transition-colors flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-6xl mb-6">diamond</span>
            <h3 className="text-3xl font-black uppercase mb-4">Apex Tier</h3>
            <p className="opacity-70 font-sans">Primary branding across major festival touchpoints, stage visibility, and premium sponsor placement.</p>
          </div>

          <div className="p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-on-surface hover:bg-primary-container group transition-colors flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-6xl mb-6">workspace_premium</span>
            <h3 className="text-3xl font-black uppercase mb-4">Vanguard Tier</h3>
            <p className="opacity-70 font-sans">Strong event-day visibility with booth space, co-branding opportunities, and focused student engagement.</p>
          </div>

          <div className="p-12 hover:bg-primary-container group transition-colors flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-6xl mb-6">military_tech</span>
            <h3 className="text-3xl font-black uppercase mb-4">Module Tier</h3>
            <p className="opacity-70 font-sans">Targeted sponsorship for specific event modules aligned with your technical domain.</p>
          </div>
        </div>

        <div className="brutal-border p-12 text-center max-w-4xl mx-auto bg-surface-container-low">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Initialize Partnership</h2>
          <p className="font-sans opacity-80 mb-8 max-w-2xl mx-auto">
            To request the sponsorship prospectus and begin coordination, contact the KRATOS organizing team directly.
          </p>
          <a href="mailto:kratos2026@mpgi.ac.in?subject=KRATOS%202026%20Sponsorship%20Inquiry" className="inline-block px-8 py-4 bg-primary text-on-primary font-display font-bold uppercase tracking-widest brutal-border hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_var(--on-surface)]">
            Contact Sponsorship Desk
          </a>
        </div>
      </div>
    </main>
  );
}
