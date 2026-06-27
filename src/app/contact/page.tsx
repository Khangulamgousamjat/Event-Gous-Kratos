import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Kratos 2026',
  description: 'Get in touch with the Kratos 2026 team at Matoshri Pratishthan Group of Institutions, Nanded.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FEFCE8] text-on-surface font-sans selection:bg-primary-container">
      <div className="pt-16 pb-24 px-6 max-w-[1440px] mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-16">
          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-4 block">
            CONTACT
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
            GET IN TOUCH
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-60 max-w-2xl leading-relaxed">
            For event help, registration support, or venue guidance, use the official college contact details below.
          </p>
        </div>

        {/* ── TOP SECTION: EMAIL & PHONE ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 brutal-border overflow-hidden mb-8 bg-white">
          {/* Email Box */}
          <div className="p-10 border-b-2 md:border-b-0 md:border-r-2 border-on-surface group hover:bg-[#FEFCE8] transition-colors">
            <span className="material-symbols-outlined text-4xl text-[#D4AF37] mb-8 block transition-transform group-hover:scale-110">
              mail
            </span>
            <h2 className="text-3xl font-black uppercase mb-6 tracking-tight">EMAIL</h2>
            <div className="space-y-2">
              <a href="mailto:gousk2004@gmail.com" className="text-xl font-bold hover:text-[#D4AF37] transition-colors block">
                gousk2004@gmail.com
              </a>
              <a href="https://mpgi.ac.in/school-of-engineering/" target="_blank" rel="noreferrer" className="text-base font-bold opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all block">
                School of Engineering Page
              </a>
            </div>
          </div>

          {/* Phone Box */}
          <div className="p-10 group hover:bg-[#FEFCE8] transition-colors">
            <span className="material-symbols-outlined text-4xl text-[#D4AF37] mb-8 block transition-transform group-hover:scale-110">
              call
            </span>
            <h2 className="text-3xl font-black uppercase mb-6 tracking-tight">PHONE</h2>
            <div className="space-y-4">
              <a href="tel:+918625076618" className="text-xl font-bold hover:text-[#D4AF37] transition-colors block">
                +91 8625076618
              </a>
              <p className="text-sm font-bold opacity-60 leading-relaxed uppercase">
                Matoshri Pratishthan Group of Institutions, <br />
                Jijau Nagar, Off Nanded-Latur Highway, Khupsarwadi, Post Vishnupuri, <br />
                Nanded, Maharashtra 431606
              </p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION: ORGANIZERS & MAP ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Organizers Contacts */}
          <div className="lg:col-span-5 brutal-border bg-white p-10 flex flex-col h-full">
            <h3 className="text-2xl font-black uppercase mb-10 tracking-tight border-b-2 border-on-surface pb-4">
              ORGANIZER CONTACTS
            </h3>

            <div className="space-y-8 flex-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">FACULTY COORDINATOR</p>
                <p className="text-lg font-black uppercase">DR. ABDULLAH M.K</p>
                <p className="text-xs font-mono opacity-70">+91 9076433185</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">FACULTY COORDINATOR</p>
                <p className="text-lg font-black uppercase">MR. SHAIKH AJIJ</p>
                <p className="text-xs font-mono opacity-70">+91 9112391234</p>
              </div>

              <div className="pt-4 border-t border-on-surface/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">FULL STACK DEVELOPER</p>
                <p className="text-lg font-black uppercase leading-none">Gulamgous Khan</p>
                <a
                  href="https://www.instagram.com/khn.vibes?igsh=MXkwZGIxeHQwZzBnNA=="
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono opacity-70 mt-1 hover:opacity-100 hover:text-[#D4AF37] transition-all lowercase"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>khn.vibes</span>
                </a>
                  <a
                  href="https://www.linkedin.com/in/gulamgous"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono opacity-70 mt-1 hover:opacity-100 hover:text-[#D4AF37] transition-all lowercase"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  <span>gulamgous</span>
                </a>
                <a
                  href="https://github.com/Khangulamgousamjat"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono opacity-70 mt-1 hover:opacity-100 hover:text-[#D4AF37] transition-all lowercase"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S9 17.44 9 18v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                  </svg>
                  <span>Khangulamgousamjat</span>
                </a>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="lg:col-span-7 brutal-border bg-white p-4 h-[500px] lg:h-auto overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.414376889991!2d77.2543895!3d19.089468999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bce29f6fffffffd%3A0xf705e1b2a364d350!2sMatoshri%20Pratishthan%20Group%20of%20Institutions!5e0!3m2!1sen!2sin!4v1774950391879!5m2!1sen!2sin"
              className="w-full h-full brutal-border"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </main>
  );
}
