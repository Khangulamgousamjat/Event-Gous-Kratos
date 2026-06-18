import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Kratos 2026',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface selection:bg-primary selection:text-on-primary font-sans">
      <div className="pt-12 pb-24 px-6 max-w-[800px] mx-auto w-full">
        <div className="mb-16">
          <span className="text-sm font-display font-bold uppercase tracking-widest text-primary mb-2 block">Legal Directives</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">Privacy Policy</h1>
        </div>

        <div className="space-y-8 font-sans opacity-80 leading-relaxed">
          <p>
            At KRATOS 2026, accessible from our official domain, one of our main priorities is the privacy of our visitors and participants. This policy explains what we collect and how we use it.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">Log Files &amp; Data Collection</h2>
          <p>
            KRATOS 2026 follows a standard procedure of using log files. These files can include internet protocol (IP) addresses, browser type, internet service provider (ISP), timestamps, referring or exit pages, and click counts. They are not linked to personally identifiable information and are used for analytics, administration, and service improvement.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">Registration Information</h2>
          <p>
            When you register for events or sign in to the dashboard, we collect the details needed to run the festival safely and accurately, including your name, college, branch, year, phone number, and email address.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">Consent</h2>
          <p>
            By using the platform, you consent to this privacy policy and to the terms required to operate KRATOS 2026 registrations, check-in, communication, and results.
          </p>
        </div>
      </div>
    </main>
  );
}
