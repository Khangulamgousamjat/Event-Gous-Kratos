import React from 'react';

export const metadata = {
  title: 'Terms of Service | Kratos 2026',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-surface selection:bg-primary selection:text-on-primary font-sans">
      <div className="pt-12 pb-24 px-6 max-w-[800px] mx-auto w-full">
        <div className="mb-16">
          <span className="text-sm font-display font-bold uppercase tracking-widest text-primary mb-2 block">Legal Directives</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">Terms of Service</h1>
        </div>

        <div className="space-y-8 font-sans opacity-80 leading-relaxed">
          <p>
            Welcome to KRATOS 2026. These terms outline the rules and responsibilities for using the registration system, participant dashboard, check-in tools, and public festival content.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">1. Acceptance of Protocol</h2>
          <p>
            By accessing this platform, you agree to the terms and conditions stated here. If you do not agree, do not continue to use KRATOS 2026 services.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">2. Registration &amp; Verification</h2>
          <p>
            Participation in KRATOS 2026 requires accurate registration details. Organizers may reject, suspend, or remove registrations that contain false information or invalid payment proof.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">3. Operational Conduct</h2>
          <p>
            Participants are expected to maintain professional conduct during physical and digital events. Any attempt to damage the platform, disrupt the event, or misrepresent results may lead to disqualification.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">4. Modifications</h2>
          <p>
            The organizing team may update event rules, schedules, or operational details before execution. Important changes will be communicated through official KRATOS 2026 channels.
          </p>
        </div>
      </div>
    </main>
  );
}
