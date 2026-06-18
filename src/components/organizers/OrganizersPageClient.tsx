
'use client';



import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';

import { motion, AnimatePresence } from 'framer-motion';

import Floating3D from '@/components/ui/Floating3D';

import { Search, X, ChevronDown } from 'lucide-react';



// Brand icons not available in lucide-react — using inline SVGs

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (

  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">

    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />

  </svg>

);



const InstagramIcon = ({ size = 16 }: { size?: number }) => (

  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">

    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />

  </svg>

);



// ─── TYPES ───────────────────────────────────────────────────────────────

interface Organizer {

  id: string;

  organizerName: string;

  role: string | null;

  contact: string | null;

  imageUrl: string | null;

  description: string | null;

  department: string | null;

  linkedin: string | null;

  instagram: string | null;

  sortOrder: number | null;

  createdAt: Date | null;

}



interface OrganizersPageClientProps {

  organizers: Organizer[];

}



// ─── CONSTANTS ───────────────────────────────────────────────────────────

const DEPARTMENTS = ['All', 'Core', 'Tech', 'Design', 'Marketing', 'Events', 'Execution'] as const;



const PLACEHOLDER_AVATAR = 'data:image/svg+xml;base64,' + btoa(`

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">

  <rect width="200" height="200" fill="#E5E5E5"/>

  <circle cx="100" cy="80" r="35" fill="#BDBDBD"/>

  <ellipse cx="100" cy="170" rx="55" ry="45" fill="#BDBDBD"/>

</svg>`);



// ─── ORGANIZER CARD ──────────────────────────────────────────────────────

const OrganizerCard = React.memo(({

  organizer,

  onClick,

  index,

}: {

  organizer: Organizer;

  onClick: () => void;

  index: number;

}) => {

  return (

    <motion.div

      layout

      initial={{ opacity: 0, y: 30, scale: 0.95 }}

      animate={{ opacity: 1, y: 0, scale: 1 }}

      exit={{ opacity: 0, y: -20, scale: 0.95 }}

      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}

      onClick={onClick}

      className="group cursor-pointer relative"

    >

      {/* Brutal offset shadow */}

      <div className="absolute inset-0 bg-on-surface translate-x-[5px] translate-y-[5px] transition-transform duration-300 group-hover:translate-x-[8px] group-hover:translate-y-[8px]" />



      {/* Card body */}

      <div className="relative glass-card p-0 overflow-hidden transition-all duration-300 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]">

        {/* Image container */}

        <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-low">

          <Image
            src={organizer.imageUrl || PLACEHOLDER_AVATAR}
            alt={organizer.organizerName}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover transition-all duration-500 ease-out filter grayscale group-hover:grayscale-0 group-hover:scale-110"
          />



          {/* Glow overlay on hover */}

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500

            bg-gradient-to-t from-[#FFD100]/20 via-transparent to-transparent" />



          {/* Department badges */}

          <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[80%]">

            {organizer.department && organizer.department.split(',').map((dept) => (

              <div key={dept} className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest

                bg-on-surface text-surface brutal-border shadow-[2px_2px_0px_0px_var(--primary-container)]">

                {dept}

              </div>

            ))}

          </div>

        </div>



        {/* Info section */}

        <div className="p-5 relative">

          {/* Glassmorphism inner panel */}

          <div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity duration-400" />



          <div className="relative z-10">

            <h3 className="text-lg font-black uppercase tracking-tight leading-tight mb-1 line-clamp-1">

              {organizer.organizerName}

            </h3>

            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">

              {organizer.role || 'Team Member'}

            </p>

            {organizer.description && (

              <p className="text-xs opacity-60 line-clamp-1 font-sans mb-3">

                {organizer.description}

              </p>

            )}



            {/* Social icons */}

            <div className="flex gap-2">

              {organizer.linkedin && (

                <a

                  href={organizer.linkedin}

                  target="_blank"

                  rel="noreferrer"

                  onClick={(e) => e.stopPropagation()}

                  className="w-8 h-8 flex items-center justify-center brutal-border bg-surface

                    hover:bg-primary-container hover:text-on-primary-container transition-all duration-200

                    hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--foreground)]"

                >

                  <LinkedinIcon size={14} />

                </a>

              )}

              {organizer.instagram && (

                <a

                  href={organizer.instagram}

                  target="_blank"

                  rel="noreferrer"

                  onClick={(e) => e.stopPropagation()}

                  className="w-8 h-8 flex items-center justify-center brutal-border bg-surface

                    hover:bg-primary-container hover:text-on-primary-container transition-all duration-200

                    hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--foreground)]"

                >

                  <InstagramIcon size={14} />

                </a>

              )}

            </div>

          </div>

        </div>

      </div>

    </motion.div>

  );

});



OrganizerCard.displayName = 'OrganizerCard';



// ─── MODAL ───────────────────────────────────────────────────────────────

const OrganizerModal = ({
  organizer,
  onClose,
}: {
  organizer: Organizer;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const GLOW_COLOR = "#00ffff";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'rgba(0,15,30,0.95)',
          backdropFilter: 'blur(45px) saturate(180%)',
          borderRadius: '28px',
          border: `1.5px solid ${GLOW_COLOR}88`,
          padding: '24px',
          width: '320px',
          maxHeight: '75vh',
          color: '#fff',
          boxShadow: `0 0 100px ${GLOW_COLOR}22, inset 0 0 30px ${GLOW_COLOR}05`,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxSizing: 'border-box'
        }}
      >
        {/* Photo Section - Expanded */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={organizer.imageUrl || '/images/organizers/dummy-0.png'}
            alt={organizer.organizerName}
            style={{
              width: '100%',
              height: '220px', 
              borderRadius: '20px',
              objectFit: 'cover',
              objectPosition: (organizer.id === 'samrat' || organizer.organizerName.toLowerCase().includes('samrat')) ? 'center center' : 'center top',
              boxShadow: `0 10px 30px rgba(0,0,0,0.6)`,
            }}
          />
          {/* Role Badge */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: GLOW_COLOR,
            color: '#000',
            padding: '2px 10px',
            borderRadius: '6px',
            fontSize: '9px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: `0 0 15px ${GLOW_COLOR}`
          }}>{organizer.role}</div>
        </div>

        {/* Info Section */}
        <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 900, color: GLOW_COLOR, textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {organizer.organizerName}
          </h3>
          <p style={{ margin: '0 0 10px', fontSize: '12px', textAlign: 'center', opacity: 0.6, letterSpacing: '2px', textTransform: 'uppercase' }}>
            {organizer.role}
          </p>

          {/* Instagram Integration */}
          {(organizer.instagram) && (
            <motion.div
              whileHover={{ scale: 1.1, color: '#ff00ff' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: GLOW_COLOR,
                marginBottom: '15px',
                fontWeight: 900,
                cursor: (organizer.instagram || "").toLowerCase().includes('why') ? 'default' : 'pointer'
              }}
              onClick={() => {
                const url = (organizer.instagram || "");
                if (!url.toLowerCase().includes('why')) window.open(url, '_blank');
              }}
            >
              {!(organizer.instagram || "").toLowerCase().includes('why') ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              ) : (
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#ff00ff', letterSpacing: '2px' }}>[ NO_SOCIAL ]</span>
              )}
              <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1px' }}>
                { (organizer.instagram || "").toLowerCase().includes('why') 
                    ? 'INSTA=WHY?' 
                    : `@${(organizer.instagram).split('instagram.com/')[1]?.split('/')[0]?.split('?')[0]}` 
                }
              </span>
            </motion.div>
          )}
          
          <div style={{ 
            height: '1px', 
            background: `linear-gradient(to right, transparent, ${GLOW_COLOR}, transparent)`,
            margin: '15px 0',
            opacity: 0.3
          }} />

          {organizer.description && (
            <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.9, textAlign: 'center', fontStyle: 'italic', marginBottom: '15px' }}>
              "{organizer.description}"
            </p>
          )}

          {organizer.contact && (
             <p style={{ fontSize: '10px', textAlign: 'center', opacity: 0.5, letterSpacing: '2px' }}>
               COMM_ID: {organizer.contact}
             </p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: GLOW_COLOR }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '14px',
            background: `${GLOW_COLOR}22`,
            border: `1px solid ${GLOW_COLOR}`,
            borderRadius: '14px',
            color: GLOW_COLOR,
            fontWeight: 900,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer'
          }}
        >
          Close Archive
        </motion.button>
      </motion.div>
    </motion.div>
  );
};


// ─── MAIN COMPONENT ──────────────────────────────────────────────────────

export default function OrganizersPageClient({ organizers }: OrganizersPageClientProps) {

  const [activeFilter, setActiveFilter] = useState<string>('All');

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);



  const filteredOrganizers = useMemo(() => {
    // Find Rani's photo if she exists
    const rani = organizers.find(org => org.organizerName?.toLowerCase().includes('rani'));
    const raniPhoto = rani?.imageUrl || '/images/organizers/dummy-2.png';

    const baseList = organizers.map(org => {
      if (org.organizerName?.toLowerCase().includes('payal')) {
        return {
          ...org,
          organizerName: 'Payal Wankhede',
          imageUrl: raniPhoto,
          instagram: 'why?'
        };
      }
      return org;
    });

    return baseList.filter((org) => {

      const matchesFilter =

        activeFilter === 'All' ||

        (org.department && (

          org.department.split(',').includes(activeFilter) || 

          org.department.split(',').includes('Core')

        ));

      const matchesSearch =

        searchQuery === '' ||

        org.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||

        (org.role && org.role.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;

    });

  }, [organizers, activeFilter, searchQuery]);



  const handleCardClick = useCallback((org: Organizer) => {

    setSelectedOrganizer(org);

  }, []);



  const handleCloseModal = useCallback(() => {

    setSelectedOrganizer(null);

  }, []);



  return (

    <div className="min-h-screen bg-surface-container-low pb-24 overflow-hidden relative">

      {/* Floating 3D decorations */}

      <div className="absolute inset-0 z-0 pointer-events-none opacity-15">

        <Floating3D type="cube" size={180} className="absolute -top-10 -right-20" delay={0.5} />

        <Floating3D type="cube" size={90} className="absolute top-[60%] -left-10" delay={2.5} />

        <Floating3D type="pyramid" size={130} className="absolute top-[30%] right-[5%]" delay={4} />

        <Floating3D type="grid" className="absolute bottom-0 w-full h-[25%]" />

      </div>



      {/* ── HERO SECTION ─────────────────────────────────────────────── */}

      <section className="relative z-10 bg-on-surface text-surface border-b-8 border-primary-container overflow-hidden">

        {/* Animated gradient background */}

        <div

          className="absolute inset-0 opacity-30 animate-gradient"

          style={{

            background: 'linear-gradient(135deg, #FFD100 0%, #BC9000 25%, #1A1C1C 50%, #FFD100 75%, #BC9000 100%)',

            backgroundSize: '400% 400%',

          }}

        />



        {/* Parallax grid */}

        <div className="absolute inset-0 opacity-5"

          style={{

            backgroundImage: 'linear-gradient(to right, #FFD100 1px, transparent 1px), linear-gradient(to bottom, #FFD100 1px, transparent 1px)',

            backgroundSize: '50px 50px',

          }}

        />



        <div className="relative max-w-[1440px] mx-auto py-16 md:py-28 px-4 md:px-6">

          <motion.span

            initial={{ opacity: 0, x: -20 }}

            animate={{ opacity: 1, x: 0 }}

            className="font-mono text-primary-container text-base md:text-lg mb-4 block"

          >

            [ ORGANIZER_ROSTER_V2.0 ]

          </motion.span>



          <motion.h1

            initial={{ opacity: 0, y: 30 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.6 }}

            className="text-5xl md:text-9xl font-black uppercase italic tracking-tighter leading-none mb-6 md:mb-8"

          >

            MEET THE <br />

            <span className="text-primary-container">ORGANIZERS</span>

          </motion.h1>



          <motion.p

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            transition={{ delay: 0.3 }}

            className="max-w-3xl text-base md:text-xl font-display opacity-80 leading-relaxed uppercase"

          >

            The architects of experience — the passionate minds who design, build, and execute KRATOS 2026.

          </motion.p>



          {/* Coordinator Recruitment CTA */}

          <motion.div

            initial={{ opacity: 0, x: -20 }}

            animate={{ opacity: 1, x: 0 }}

            transition={{ delay: 0.4 }}

            className="mt-8 flex flex-wrap items-center gap-4 group"

          >

            <div className="flex items-center gap-3 bg-primary-container text-on-primary-container px-4 py-2 brutal-border shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all duration-300 group-hover:shadow-[6px_6px_0px_0px_var(--primary-container)] group-hover:bg-surface group-hover:text-on-surface">

              <div className="w-2 h-2 rounded-full bg-on-primary-container animate-pulse group-hover:bg-primary-container" />

              <p className="text-xs md:text-sm font-black uppercase tracking-widest">

                Recruitment Open

              </p>

            </div>

            <p className="text-sm md:text-lg font-bold uppercase tracking-tight italic text-primary-container">

              Interested in becoming a coordinator? Contact <a href="tel:9834147160" className="underline decoration-2 underline-offset-4 font-black text-surface hover:text-primary-container transition-colors">9834147160</a>

            </p>

          </motion.div>




          {/* Stats bar (glassmorphism) */}

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: 0.5 }}

            className="mt-10 inline-flex gap-8 glass-dark px-8 py-4"

          >

            <div>

              <p className="text-[10px] font-black uppercase tracking-widest text-primary-container/60">Total</p>

              <p className="text-2xl font-black font-display">{organizers.length}</p>

            </div>

            <div className="w-[1px] bg-surface/20" />

            <div>

              <p className="text-[10px] font-black uppercase tracking-widest text-primary-container/60">Departments</p>

              <p className="text-2xl font-black font-display">

                {new Set(organizers.map((o) => o.department).filter(Boolean)).size}

              </p>

            </div>

          </motion.div>

        </div>



        {/* Scroll indicator */}

        <motion.div

          animate={{ y: [0, 8, 0] }}

          transition={{ duration: 1.5, repeat: Infinity }}

          className="absolute bottom-6 left-1/2 -translate-x-1/2"

        >

          <ChevronDown className="text-primary-container" size={28} />

        </motion.div>

      </section>



      {/* ── SEARCH + FILTER ──────────────────────────────────────────── */}

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 mt-10 md:mt-16 relative z-10">

        {/* Search bar */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 0.2 }}

          className="mb-6"

        >

          <div className="relative max-w-lg">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40" size={18} />

            <input

              type="text"

              placeholder="Search organizers by name or role..."

              value={searchQuery}

              onChange={(e) => setSearchQuery(e.target.value)}

              className="w-full pl-12 pr-4 py-3.5 brutal-border bg-surface glass-card

                text-sm font-mono font-bold uppercase outline-none

                focus:shadow-[6px_6px_0px_0px_var(--primary-container)]

                transition-all duration-200 placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:opacity-40"

              id="organizer-search-input"

            />

            {searchQuery && (

              <button

                onClick={() => setSearchQuery('')}

                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-container/20 transition-colors"

              >

                <X size={16} />

              </button>

            )}

          </div>

        </motion.div>



        {/* Filter bar */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 0.3 }}

          className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-14"

        >

          {DEPARTMENTS.map((dept) => (

            <motion.button

              key={dept}

              onClick={() => setActiveFilter(dept)}

              whileTap={{ scale: 0.95 }}

              className={`px-4 md:px-6 py-2.5 text-xs md:text-sm font-black uppercase tracking-wider

                brutal-border transition-all duration-200

                ${activeFilter === dept

                  ? 'bg-on-surface text-surface shadow-[4px_4px_0px_0px_var(--primary-container)] -translate-x-[1px] -translate-y-[1px]'

                  : 'bg-surface text-on-surface hover:bg-primary-container/20 hover:shadow-[3px_3px_0px_0px_var(--foreground)] hover:-translate-x-[1px] hover:-translate-y-[1px]'

                }`}

              id={`filter-btn-${dept.toLowerCase()}`}

            >

              {dept}

            </motion.button>

          ))}

        </motion.div>



        {/* Results count */}

        <div className="mb-6 flex items-center gap-3">

          <div className="w-3 h-3 bg-primary-container" />

          <span className="text-xs font-black uppercase tracking-widest opacity-40">

            {filteredOrganizers.length} {filteredOrganizers.length === 1 ? 'organizer' : 'organizers'} found

          </span>

        </div>



        {/* ── ORGANIZER GRID ───────────────────────────────────────────── */}

        <AnimatePresence mode="popLayout">

          {filteredOrganizers.length === 0 ? (

            <motion.div

              key="empty"

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              exit={{ opacity: 0 }}

              className="text-center py-24 brutal-border bg-surface"

            >

              <p className="text-3xl font-black uppercase italic opacity-20 mb-2">NO ORGANIZERS FOUND</p>

              <p className="text-sm opacity-40 font-sans">Try adjusting your search or filter</p>

            </motion.div>

          ) : (

            <motion.div

              layout

              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"

            >

              {filteredOrganizers.map((org, i) => (

                <OrganizerCard

                  key={org.id}

                  organizer={org}

                  onClick={() => handleCardClick(org)}

                  index={i}

                />

              ))}

            </motion.div>

          )}

        </AnimatePresence>

      </div>



      {/* ── MODAL ─────────────────────────────────────────────────────── */}

      <AnimatePresence>

        {selectedOrganizer && (

          <OrganizerModal

            organizer={selectedOrganizer}

            onClose={handleCloseModal}

          />

        )}

      </AnimatePresence>

    </div>

  );

}
