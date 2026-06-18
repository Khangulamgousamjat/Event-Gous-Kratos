'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalQRCode from '@/components/ui/BrutalQRCode';
import { CldUploadWidget } from 'next-cloudinary';
import { createRegistration } from '@/lib/actions';

const StepHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="relative mb-8">
    <div className="absolute -top-4 -left-4 bg-on-surface text-surface px-4 py-1 font-display font-black text-xl">
      {number}
    </div>
    <h2 className="text-3xl font-black uppercase tracking-tighter ml-4">{title}</h2>
  </div>
);

type RegistrationClientFormProps = {
  eventId: string;
  eventFormat: string;
  isTeamFormat: boolean;
  isTeamRequired: boolean;
  teamSizeMin: number;
  teamSizeMax: number;
  eventData: {
    upiId: string;
    feePerPerson: number;
    requiresPayment: boolean;
  };
  dbUser: {
    name: string;
    phone: string | null;
    college: string | null;
    branch: string | null;
    year: number | null;
  };
};

export default function RegistrationClientForm({
  eventId,
  eventFormat,
  isTeamFormat,
  isTeamRequired,
  teamSizeMin,
  teamSizeMax,
  eventData,
  dbUser,
}: RegistrationClientFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState<number>(Math.max(0, (teamSizeMin || 1) - 1));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const totalFee = Math.max(1 + memberCount, 1) * (eventData.feePerPerson || 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (eventData.requiresPayment && !imageUrl) {
      setError('Please upload the payment screenshot to proceed.');
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('eventId', eventId);
    if (imageUrl) {
      formData.append('paymentScreenshot', imageUrl);
    }

    const result = await createRegistration(formData);

    if (result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      {error && (
        <div className="bg-red-500 text-white p-4 font-bold border-2 border-on-surface mb-8">
          CRITICAL ERROR: {error}
        </div>
      )}

      <BrutalCard shadow={true}>
        <StepHeader number="01" title={isTeamFormat ? 'Team Details' : 'Your Details'} />
        <div className="space-y-6">
          <div className="bg-primary/10 border-2 border-primary p-6 mb-8">
            <h3 className="font-display font-black tracking-tighter uppercase mb-2">Team Leader</h3>
            <p className="text-xs font-bold font-sans opacity-70 mb-4">Your basic details are verified.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 pointer-events-none">
              <BrutalInput label="Your Name" defaultValue={dbUser.name} required />
              <BrutalInput label="Your Phone" defaultValue={dbUser.phone || ''} required />
              <BrutalInput label="Your College" defaultValue={dbUser.college || ''} required />
              <BrutalInput label="Your Branch" defaultValue={dbUser.branch || ''} required />
              <BrutalInput label="Your Year" defaultValue={dbUser.year ? String(dbUser.year) : ''} required />
            </div>
          </div>

          {isTeamFormat && (
            <div className="space-y-6 mt-8 pt-8 border-t-2 border-on-surface">
              <h3 className="font-display text-2xl font-black tracking-tighter uppercase mb-4">Team Members</h3>
              {(eventFormat === 'SOLO_TEAM' || eventFormat === 'SOLO_PAIR') && (
                <p className="text-xs font-bold opacity-60 italic mb-4">
                  Note: team details are optional for solo/team format events. Fill them only if participating as a team.
                </p>
              )}
              <BrutalInput label="Team Name" name="teamName" placeholder="e.g. Innovators" required={isTeamRequired} />

              <div className="space-y-6 mt-4">
                {Array.from({ length: memberCount }).map((_, i) => (
                  <div key={i} className="p-6 border-2 border-on-surface bg-surface-container-low relative">
                    <div className="absolute -top-3 left-4 bg-on-surface text-surface px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                      Member 0{i + 2}
                    </div>
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => setMemberCount((prev) => Math.max(teamSizeMin - 1, prev - 1))}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                      <BrutalInput name={`member_${i}_name`} label="Full Name" placeholder={`Member ${i + 2} Name`} required={isTeamRequired} />
                      <BrutalInput name={`member_${i}_phone`} label="Phone" placeholder="+91 00000 00000" required={isTeamRequired} />
                      <BrutalInput name={`member_${i}_college`} label="College" placeholder="Institution Name" required={false} />
                      <BrutalInput name={`member_${i}_branch`} label="Branch" placeholder="CSE / ECE / ..." required={false} />
                      <BrutalInput name={`member_${i}_year`} label="Year" type="number" min={1} max={6} placeholder="2" required={false} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setMemberCount((prev) => Math.min(teamSizeMax - 1, prev + 1))}
                  className="px-6 py-2 border-2 border-dashed border-on-surface/50 text-xs font-black uppercase tracking-widest hover:bg-primary-container hover:border-primary-container transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined mr-2 text-sm">add</span>
                  Add Team Member
                </button>
              </div>
            </div>
          )}
        </div>
      </BrutalCard>

      <BrutalCard shadow={true}>
        <StepHeader number="02" title={eventData.requiresPayment ? 'Payment' : 'Registration Summary'} />
        <div className="flex flex-col md:flex-row gap-8 items-center bg-surface-container-low p-6 brutal-border">
          {eventData.requiresPayment ? (
            <div className="w-48 h-48 bg-white p-2 border-2 border-on-surface flex items-center justify-center relative overflow-hidden">
              <BrutalQRCode
                data={`upi://pay?pa=${encodeURIComponent(eventData.upiId)}&pn=${encodeURIComponent('SHAIKH RAHIL HUSAIN SHAUKAT HUSSAIN')}&cu=INR&am=${totalFee}`}
                size={160}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="w-48 h-48 border-2 border-on-surface flex items-center justify-center bg-primary-container text-on-primary-container font-display font-black text-center text-2xl uppercase p-6">
              Free Entry
            </div>
          )}

          <div className="flex-1 space-y-4">
            {eventData.requiresPayment ? (
              <>
                <div>
                  <p className="text-[10px] font-display font-bold uppercase tracking-widest opacity-60">Official UPI ID</p>
                  <p className="text-2xl font-black tracking-tighter uppercase">{eventData.upiId}</p>
                  <p className="text-[10px] font-bold uppercase text-primary mt-1">
                    A/C: SHAIKH RAHIL HUSAIN SHAUKAT HUSSAIN
                  </p>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-display font-bold uppercase tracking-widest opacity-60 mt-2">Total Fee</p>
                    <p className="text-4xl font-black text-primary" style={{ textShadow: '2px 2px 0px #F9F9F9' }}>{`INR ${totalFee}.00`}</p>
                  </div>
                </div>
                <div className="w-full">
                  <BrutalInput name="transactionId" label="Transaction / UTR ID" placeholder="Enter 12-digit UTR No." required />
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] font-display font-bold uppercase tracking-widest opacity-60">Registration Fee</p>
                <p className="text-4xl font-black text-primary" style={{ textShadow: '2px 2px 0px #F9F9F9' }}>FREE</p>
                <p className="text-sm font-bold uppercase opacity-70">
                  No payment screenshot or transaction ID is required for this event.
                </p>
              </div>
            )}
          </div>
        </div>
      </BrutalCard>

      {eventData.requiresPayment ? (
        <BrutalCard shadow={true} shadowColor="gold">
          <StepHeader number="03" title="Upload Screenshot" />

          {!uploadPreset ? (
            <div className="border-2 border-red-600 bg-red-50 p-8 text-center">
              <p className="font-black uppercase text-red-900">Cloudinary upload preset is missing.</p>
              <p className="text-xs font-bold uppercase text-red-700 mt-2">
                Add `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` before accepting registrations.
              </p>
            </div>
          ) : (
            <CldUploadWidget
              uploadPreset={uploadPreset}
              options={{
                maxFiles: 1,
                multiple: false,
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
              }}
              onSuccess={(result) => {
                if (result.info && typeof result.info !== 'string') {
                  setImageUrl(result.info.secure_url);
                }
              }}
            >
              {({ open }) => (
                <div
                  onClick={() => open()}
                  className={`border-2 border-dashed ${imageUrl ? 'border-primary bg-primary/10' : 'border-on-surface/30 bg-surface-container-low'} p-12 text-center hover:border-primary transition-colors group cursor-pointer`}
                >
                  <span className={`material-symbols-outlined text-6xl ${imageUrl ? 'text-primary' : 'text-on-surface/20'} group-hover:text-primary mb-4 transition-colors`}>
                    {imageUrl ? 'check_circle' : 'cloud_upload'}
                  </span>
                  <p className="font-display font-bold uppercase tracking-tighter text-lg">
                    {imageUrl ? 'Screenshot Uploaded Successfully!' : 'Upload Payment Screenshot'}
                  </p>
                  <p className="text-sm opacity-60 mt-2 font-mono">
                    {imageUrl ? 'Ready for submission.' : 'JPEG, PNG or WEBP only (Max 5MB)'}
                  </p>
                </div>
              )}
            </CldUploadWidget>
          )}

          <div className="mt-8 flex items-start gap-4 p-4 brutal-border bg-surface-container-low">
            <input className="mt-1 w-5 h-5 brutal-border rounded-none checked:bg-primary accent-primary focus:ring-0" id="terms" type="checkbox" required />
            <label className="text-sm font-bold leading-tight opacity-70 uppercase tracking-tight" htmlFor="terms">
              I confirm the details and payment proof are correct.
            </label>
          </div>

          <BrutalButton className="w-full mt-10" size="xl" disabled={loading || !uploadPreset}>
            {loading ? 'Submitting...' : 'Complete Registration'}
          </BrutalButton>
        </BrutalCard>
      ) : (
        <BrutalCard shadow={true} shadowColor="gold">
          <StepHeader number="03" title="Finalize Registration" />
          <div className="p-6 brutal-border bg-surface-container-low">
            <p className="text-sm font-bold uppercase opacity-70">
              Review your team details and complete the registration. Free events go straight into the dashboard once submitted.
            </p>
          </div>
          <div className="mt-8 flex items-start gap-4 p-4 brutal-border bg-surface-container-low">
            <input className="mt-1 w-5 h-5 brutal-border rounded-none checked:bg-primary accent-primary focus:ring-0" id="terms-free" type="checkbox" required />
            <label className="text-sm font-bold leading-tight opacity-70 uppercase tracking-tight" htmlFor="terms-free">
              I confirm the registration details are correct.
            </label>
          </div>

          <BrutalButton className="w-full mt-10" size="xl" disabled={loading}>
            {loading ? 'Submitting...' : 'Complete Registration'}
          </BrutalButton>
        </BrutalCard>
      )}
    </form>
  );
}
