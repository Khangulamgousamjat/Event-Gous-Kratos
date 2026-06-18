'use client';

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import BrutalButton from '@/components/ui/BrutalButton';
import { submitRegistration } from './actions';
import {
  getEventMaxParticipants,
  getEventMinParticipants,
  getEventParticipationOptions,
  isAllowedPaymentScreenshotFormat,
  isValidPhone,
  normalizeText,
  PAYMENT_SCREENSHOT_ALLOWED_FORMATS,
  PAYMENT_SCREENSHOT_MAX_BYTES,
  type PaymentScreenshotUpload,
  type RegistrationMemberInput,
} from '@/lib/registration';

const BRANCHES = [
  'Civil Engineering',
  'Computer Science Engineering',
  'Electrical Engineering',
  'Mechanical and Automation Engineering',
  'Electronics and Telecommunication Engineering',
  'Artificial Intelligence (AI) and Data Science',
  'Artificial Intelligence (AI) and Machine Learning',
];

type EventOption = {
  fee: number;
  format: string | null;
  id: string;
  name: string;
  slug: string;
  teamSize: number | null;
  teamSizeMin: number | null;
};

type UploadWidgetResult = {
  info?: string | { bytes?: number; format?: string; secure_url?: string };
};

type UnifiedRegistrationFormProps = {
  events: EventOption[];
  initialEventId?: string;
  upiId: string;
};

function createEmptyMember(): RegistrationMemberInput {
  return {
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    year: '1',
  };
}

function createMemberList(count: number, existingMembers: RegistrationMemberInput[] = []) {
  const nextMembers = existingMembers.slice(0, count);

  while (nextMembers.length < count) {
    nextMembers.push(createEmptyMember());
  }

  return nextMembers;
}

function getInitialState(events: EventOption[], initialEventId: string | undefined) {
  const initialEvent = events.find((event) => event.id === initialEventId) ?? null;
  const options = getEventParticipationOptions(initialEvent?.format);
  const teamMode = options.requireTeam;
  const initialCount = getEventMinParticipants(initialEvent?.format, initialEvent?.teamSizeMin, teamMode);

  return {
    initialEvent,
    initialMembers: createMemberList(initialCount),
    initialTeamMode: teamMode,
  };
}

export default function UnifiedRegistrationForm({
  events,
  initialEventId = '',
  upiId,
}: UnifiedRegistrationFormProps) {
  const { initialEvent, initialMembers, initialTeamMode } = getInitialState(events, initialEventId);

  const [selectedEventId, setSelectedEventId] = useState(initialEvent?.id ?? '');
  const [isTeamMode, setIsTeamMode] = useState(initialTeamMode);
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<RegistrationMemberInput[]>(initialMembers);
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<PaymentScreenshotUpload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;
  const participationOptions = getEventParticipationOptions(selectedEvent?.format);
  const effectiveTeamMode = participationOptions.requireTeam ? true : isTeamMode;
  const minParticipants = getEventMinParticipants(
    selectedEvent?.format,
    selectedEvent?.teamSizeMin,
    effectiveTeamMode,
  );
  const maxParticipants = getEventMaxParticipants(selectedEvent?.teamSize);
  const requiresPayment = Boolean(selectedEvent && selectedEvent.fee > 0);

  const syncMembersForSelection = (event: EventOption | null, teamMode: boolean, existingMembers: RegistrationMemberInput[]) => {
    const nextMinParticipants = getEventMinParticipants(event?.format, event?.teamSizeMin, teamMode);
    const nextMaxParticipants = getEventMaxParticipants(event?.teamSize);
    return createMemberList(Math.min(nextMaxParticipants, nextMinParticipants), existingMembers);
  };

  const handleEventChange = (eventId: string) => {
    const event = events.find((entry) => entry.id === eventId) ?? null;
    const options = getEventParticipationOptions(event?.format);
    const nextTeamMode = options.requireTeam;

    setSelectedEventId(eventId);
    setIsTeamMode(nextTeamMode);
    setTeamName('');
    setMembers((currentMembers) => syncMembersForSelection(event, nextTeamMode, currentMembers));
    setTransactionId('');
    setPaymentScreenshot(null);
    setError('');
    setSuccess(false);
  };

  const handleTeamModeChange = (nextTeamMode: boolean) => {
    if (!selectedEvent || participationOptions.requireTeam) {
      return;
    }

    setIsTeamMode(nextTeamMode);
    setMembers((currentMembers) => syncMembersForSelection(selectedEvent, nextTeamMode, currentMembers));
    setError('');
  };

  const handleMemberChange = (index: number, field: keyof RegistrationMemberInput, value: string) => {
    setMembers((currentMembers) => {
      const nextMembers = [...currentMembers];
      nextMembers[index] = { ...nextMembers[index], [field]: value };

      // Sync college from leader to all members if leader's college is changed
      if (index === 0 && field === 'college') {
        for (let i = 1; i < nextMembers.length; i++) {
          nextMembers[i] = { ...nextMembers[i], college: value };
        }
      }

      return nextMembers;
    });
  };

  const addMember = () => {
    setMembers((currentMembers) => createMemberList(Math.min(currentMembers.length + 1, maxParticipants), currentMembers));
  };

  const removeMember = (index: number) => {
    setMembers((currentMembers) => {
      const nextMembers = currentMembers.filter((_, memberIndex) => memberIndex !== index);
      return createMemberList(Math.max(nextMembers.length, minParticipants), nextMembers);
    });
  };

  const validateForm = () => {
    if (!selectedEvent) {
      return 'Please select an event.';
    }

    if (effectiveTeamMode && members.length < minParticipants) {
      return 'Team members required';
    }

    if (effectiveTeamMode && !normalizeText(teamName || '')) {
      return 'Please enter a team name';
    }

    for (const [index, member] of members.entries()) {
      if (
        !normalizeText(member.name || '') ||
        !normalizeText(member.phone || '') ||
        !normalizeText(member.college || '') ||
        !normalizeText(member.branch || '')
      ) {
        return 'Please fill in all required fields.';
      }

      if (index === 0 && !normalizeText(member.email || '')) {
        return 'Please fill in all required fields.';
      }

      if (!isValidPhone(member.phone)) {
        return 'Please enter valid phone number';
      }
    }

    if (requiresPayment && !normalizeText(transactionId || '')) {
      return 'Please enter the transaction ID.';
    }

    if (requiresPayment && !paymentScreenshot) {
      return 'Upload payment screenshot';
    }

    return '';
  };

  const handleUploadSuccess = (result: UploadWidgetResult) => {
    if (!result.info || typeof result.info === 'string') {
      setError('Upload failed. Please try again.');
      return;
    }

    const format = result.info.format?.toLowerCase() ?? '';
    const bytes = result.info.bytes ?? 0;
    const url = result.info.secure_url ?? '';

    if (!url || !isAllowedPaymentScreenshotFormat(format)) {
      setPaymentScreenshot(null);
      setError('Payment screenshot must be a JPG or PNG file.');
      return;
    }

    if (bytes <= 0 || bytes > PAYMENT_SCREENSHOT_MAX_BYTES) {
      setPaymentScreenshot(null);
      setError('Payment screenshot must be 5 MB or smaller.');
      return;
    }

    setPaymentScreenshot({ bytes, format, url });
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const result = await submitRegistration({
      eventId: selectedEventId,
      members,
      paymentScreenshot,
      teamFormat: effectiveTeamMode,
      teamName: effectiveTeamMode ? teamName : '',
      transactionId,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      return;
    }

    setError(result.error || 'Registration failed');
  };

  if (success) {
    return (
      <div className="bg-surface-container-low brutal-border p-8 border-l-8 border-l-green-500">
        <h2 className="text-4xl font-black uppercase italic mb-4">Registration Submitted</h2>
        <p className="font-sans font-bold">Your registration is now pending review.</p>
        <p className="mt-4">
          Use your phone number or transaction ID on the <a href="/status" className="underline text-primary">Check Status</a>{' '}
          page to track approval.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 bg-surface/50 backdrop-blur-md p-4 md:p-12 brutal-border hard-shadow">
      {error ? <div className="bg-red-100 text-red-900 p-6 font-black border-4 border-red-500 uppercase italic animate-pulse">{error}</div> : null}

      <div className="space-y-4 md:space-y-6">
        <label className="font-display font-black text-2xl md:text-5xl uppercase italic tracking-tighter leading-none block">
          01. Select Event
        </label>
        <div className="relative group">
          <select
            className="w-full bg-surface brutal-input p-4 md:p-6 font-black uppercase text-lg md:text-2xl appearance-none cursor-pointer transition-all hover:bg-primary-container/10 focus:ring-4 focus:ring-primary-container/30"
            value={selectedEventId}
            onChange={(currentEvent) => handleEventChange(currentEvent.target.value)}
            required
          >
            <option value="">-- Choose an Event --</option>
            {events.map((eventOption) => (
              <option key={eventOption.id} value={eventOption.id}>
                {eventOption.name} {eventOption.fee > 0 ? `(₹${eventOption.fee})` : '(FREE)'}
              </option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none font-black text-2xl">↓</div>
        </div>
      </div>

      {selectedEvent ? (
        <>
          {participationOptions.allowTeam ? (
            <div className="space-y-6 bg-primary-container/10 p-4 md:p-8 brutal-border border-dashed">
              <label className="font-display font-black text-xl md:text-2xl uppercase italic block">02. Participation Mode</label>
              {participationOptions.requireTeam ? (
                <div className="font-black uppercase text-sm tracking-widest bg-primary-container px-4 py-2 inline-block">
                  Team registration is required for this event
                </div>
              ) : (
                <div className="flex gap-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      checked={!effectiveTeamMode}
                      onChange={() => handleTeamModeChange(false)}
                      className="w-6 h-6 border-4 border-on-surface checked:bg-primary-container accent-on-surface"
                    />
                    <span className="font-black uppercase text-xl group-hover:text-primary transition-colors">Individual</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      checked={effectiveTeamMode}
                      onChange={() => handleTeamModeChange(true)}
                      className="w-6 h-6 border-4 border-on-surface checked:bg-primary-container accent-on-surface"
                    />
                    <span className="font-black uppercase text-xl group-hover:text-primary transition-colors">Team</span>
                  </label>
                </div>
              )}

              {effectiveTeamMode ? (
                <div className="mt-8">
                  <label className="block text-xs md:text-sm font-black uppercase tracking-widest text-on-surface/80 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(currentEvent) => setTeamName(currentEvent.target.value)}
                    className="w-full bg-surface brutal-input p-4 text-xl font-bold uppercase placeholder:opacity-50"
                    placeholder="Enter team alias"
                    required={effectiveTeamMode}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-8 border-on-surface pb-4">
              <h3 className="font-display font-black text-3xl md:text-6xl uppercase italic tracking-tighter leading-none">
                03. {effectiveTeamMode ? 'Team Members' : 'Participant Details'}
              </h3>
              <span className="font-black uppercase text-sm bg-on-surface text-surface px-4 py-1">
                {members.length} of {maxParticipants} slots filled
              </span>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {members.map((member, index) => (
                <div 
                  key={`${selectedEventId || 'event'}-${index}`} 
                  className={`p-5 md:p-8 brutal-border relative group transition-all duration-300 ${
                    index === 0 ? 'bg-primary-container/5 border-l-8 border-l-primary-container' : 'bg-surface'
                  }`}
                >
                  {index >= minParticipants ? (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-red-500 text-white w-8 h-8 md:w-10 md:h-10 brutal-border hard-shadow flex items-center justify-center hover:bg-black transition-colors z-20"
                      title="Remove Member"
                    >
                      <span className="font-black text-lg md:text-xl">×</span>
                    </button>
                  ) : null}
                  
                  <div className="flex items-center gap-4 mb-8">
                    <span className="w-12 h-12 bg-on-surface text-surface flex items-center justify-center font-black text-2xl italic brutal-border">
                      {index + 1}
                    </span>
                    <h4 className="font-display font-black text-2xl uppercase italic tracking-tight">
                      {index === 0 ? 'Leader / Main Participant' : `Team Member ${index + 1}`}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1">
                      <label className="block text-xs md:text-sm font-black uppercase tracking-widest text-on-surface/80 mb-1 ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        value={member.name}
                        onChange={(currentEvent) => handleMemberChange(index, 'name', currentEvent.target.value)}
                        className="brutal-input p-4 w-full font-bold text-lg placeholder:opacity-50"
                      />
                    </div>
                    
                    {index === 0 ? (
                      <div className="space-y-1">
                        <label className="block text-xs md:text-sm font-black uppercase tracking-widest text-on-surface/80 mb-1 ml-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={member.email}
                          onChange={(currentEvent) => handleMemberChange(index, 'email', currentEvent.target.value)}
                          className="brutal-input p-4 w-full font-bold text-lg placeholder:opacity-50"
                        />
                      </div>
                    ) : null}

                    <div className="space-y-1">
                      <label className="block text-xs md:text-sm font-black uppercase tracking-widest text-on-surface/80 mb-1 ml-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        required
                        value={member.phone}
                        onChange={(currentEvent) => handleMemberChange(index, 'phone', currentEvent.target.value)}
                        className="brutal-input p-4 w-full font-bold text-lg placeholder:opacity-50"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-4 pt-4 border-t-2 border-on-surface/5">
                      <label className="block text-xs font-black uppercase tracking-widest text-primary italic">Institutional Details</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <select
                            required
                            value={member.college === 'Matoshri Pratishthan Group of Institutions, Nanded' ? 'Matoshri Pratishthan Group of Institutions, Nanded' : member.college ? 'Other' : ''}
                            onChange={(currentEvent) => {
                              const val = currentEvent.target.value;
                              if (val === 'Matoshri Pratishthan Group of Institutions, Nanded') {
                                handleMemberChange(index, 'college', 'Matoshri Pratishthan Group of Institutions, Nanded');
                              } else {
                                handleMemberChange(index, 'college', '');
                              }
                            }}
                            className="brutal-input p-4 w-full bg-surface font-black uppercase text-sm h-full"
                          >
                            <option value="">-- College --</option>
                            <option value="Matoshri Pratishthan Group of Institutions, Nanded">MPGI Nanded</option>
                            <option value="Other">Other College</option>
                          </select>
                        </div>
                        
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            placeholder="Type College Name..."
                            disabled={member.college === 'Matoshri Pratishthan Group of Institutions, Nanded'}
                            required={member.college !== 'Matoshri Pratishthan Group of Institutions, Nanded'}
                            value={member.college === 'Matoshri Pratishthan Group of Institutions, Nanded' ? 'Matoshri Pratishthan Group of Institutions, Nanded' : member.college}
                            onChange={(currentEvent) => handleMemberChange(index, 'college', currentEvent.target.value)}
                            className={`brutal-input p-4 w-full font-bold text-sm h-full ${member.college === 'Matoshri Pratishthan Group of Institutions, Nanded' ? 'opacity-50 italic pointer-events-none bg-surface-container-low' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs md:text-sm font-black uppercase tracking-widest text-on-surface/80 mb-1 ml-1">Branch / Dept</label>
                      <select
                        required
                        value={member.branch}
                        onChange={(currentEvent) => handleMemberChange(index, 'branch', currentEvent.target.value)}
                        className="brutal-input p-4 w-full font-bold text-sm appearance-none"
                      >
                        <option value="">-- Select Branch --</option>
                        {BRANCHES.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs md:text-sm font-black uppercase tracking-widest text-on-surface/80 mb-1 ml-1">Current Year</label>
                      <select
                        required
                        value={member.year}
                        onChange={(currentEvent) => handleMemberChange(index, 'year', currentEvent.target.value)}
                        className="brutal-input p-4 w-full font-bold text-sm appearance-none"
                      >
                        <option value="1">1st Year (Freshman)</option>
                        <option value="2">2nd Year (Sophomore)</option>
                        <option value="3">3rd Year (Junior)</option>
                        <option value="4">4th Year (Senior)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {effectiveTeamMode && members.length < maxParticipants ? (
              <BrutalButton type="button" variant="outline" onClick={addMember} className="w-full py-4 md:py-6 text-lg md:text-xl font-black uppercase tracking-widest italic group">
                <span className="group-hover:mr-4 transition-all tracking-tighter mr-2">+</span> Add Team Member
              </BrutalButton>
            ) : null}
          </div>

          {requiresPayment ? (
            <div className="bg-on-surface text-surface p-5 md:p-10 brutal-border hard-shadow-gold italic space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 -rotate-45 translate-x-16 -translate-y-16" />
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                <div className="space-y-6 flex-1">
                  <h3 className="font-black text-2xl md:text-4xl uppercase text-primary-container leading-none">
                    Payment Required
                  </h3>
                  
                  <div className="space-y-2">
                    <p className="font-sans text-lg opacity-80">
                      Event Fee: <strong className="text-xl">INR {selectedEvent.fee}</strong>
                    </p>
                    <p className="font-sans text-lg opacity-80">
                      Total Members: <strong className="text-xl">{members.length}</strong>
                    </p>
                    <div className="h-0.5 bg-surface/20 w-32" />
                    <p className="font-display font-black text-xl md:text-4xl uppercase text-primary-container mt-4">
                      Total: INR {selectedEvent.fee * members.length}
                    </p>
                  </div>

                  <div className="bg-surface/5 p-4 border-2 border-surface/20 space-y-2">
                    <p className="text-xs font-black uppercase opacity-60">UPI ID for Manual Entry</p>
                    <div className="font-mono text-lg select-all break-all">{upiId}</div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-center justify-center gap-4 bg-white p-4 md:p-6 brutal-border mx-auto md:mx-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `upi://pay?pa=${upiId}&pn=KRATOS%202026&am=${selectedEvent.fee * members.length}&cu=INR&tn=Registration%20for%20${selectedEvent.name}`,
                    )}`}
                    alt="Payment QR Code"
                    className="w-40 h-40 md:w-48 md:h-48 pixelated"
                  />
                  <p className="text-[9px] md:text-[10px] text-black font-black uppercase tracking-widest bg-primary-container px-2 py-1 text-center">
                    Scan to Pay INR {selectedEvent.fee * members.length}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold uppercase text-primary-container">Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(currentEvent) => setTransactionId(currentEvent.target.value)}
                  className="w-full bg-surface text-on-surface brutal-input p-3"
                  placeholder="Enter your UTR or transaction ID"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold uppercase text-primary-container">Payment Screenshot</label>
                {!uploadPreset ? (
                  <div className="border-2 border-red-500 bg-red-50 text-red-900 p-4 font-bold">
                    Cloudinary upload is not configured. Add the upload preset before opening registrations.
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={uploadPreset}
                    options={{
                      clientAllowedFormats: [...PAYMENT_SCREENSHOT_ALLOWED_FORMATS],
                      maxFileSize: PAYMENT_SCREENSHOT_MAX_BYTES,
                      maxFiles: 1,
                      multiple: false,
                      resourceType: 'image',
                    }}
                    onError={() => {
                      setPaymentScreenshot(null);
                      setError('Upload failed. Please try again.');
                    }}
                    onSuccess={(result) => handleUploadSuccess(result as UploadWidgetResult)}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open?.()}
                        className="w-full bg-primary-container text-on-primary-container p-4 font-bold border-2 border-transparent hover:border-surface transition-colors"
                      >
                        {paymentScreenshot ? 'Screenshot Attached' : 'Upload Screenshot'}
                      </button>
                    )}
                  </CldUploadWidget>
                )}
                <p className="text-xs font-bold uppercase opacity-70">JPG or PNG only, up to 5 MB.</p>
              </div>
            </div>
          ) : null}

          <BrutalButton
            type="submit"
            size="xl"
            disabled={loading || (requiresPayment && !uploadPreset)}
            className="w-full py-5 md:py-6 mt-8 text-xl md:text-2xl"
          >
            {loading ? 'Submitting...' : 'Submit Registration'}
          </BrutalButton>
        </>
      ) : null}
    </form>
  );
}
