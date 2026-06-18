import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import { db } from '@/db';
import { events, registrations, teamMembers, users } from '@/db/schema';
import { requireAdminPageAccess } from '@/lib/authz';
import { updateRegistrationStatus, deleteRegistration } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function VerifyRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageAccess();

  const { id } = await params;

  const [data] = await db
    .select({
      event: events,
      registration: registrations,
      user: users,
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.userId, users.id))
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.id, id));

  if (!data) {
    return notFound();
  }

  const { event, registration, user } = data;
  const members = registration.teamId
    ? await db.select().from(teamMembers).where(eq(teamMembers.teamId, registration.teamId))
    : [];
  const totalFee = registration.totalFee ?? event.fee;

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Review Registration</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">
            Registration ID: {registration.id}
          </p>
        </div>
        <Link
          href="/admin/registrations"
          className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors"
        >
          &larr; Return to Registrations
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8">
          <BrutalCard shadow>
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">
              Event Details
            </h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Event</span>
                <span className="font-bold">{event.name}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Base Fee</span>
                <span className="font-black text-primary">INR {event.fee}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Category</span>
                <span className="font-bold">{event.category || 'Event'}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="opacity-60 uppercase font-sans font-bold">Format</span>
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 font-bold uppercase">
                  {event.format}
                </span>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard shadow>
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">
              Participant Details
            </h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Name</span>
                <span className="font-bold truncate max-w-[220px]">{user.name}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Email</span>
                <span className="font-bold truncate max-w-[220px] text-xs">{user.email}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Phone</span>
                <span className="font-bold">{user.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between pt-2 gap-4">
                <span className="opacity-60 uppercase font-sans font-bold">College</span>
                <span className="font-bold truncate max-w-[220px] text-xs">
                  {user.college || 'Not provided'}
                  {user.branch ? ` (${user.branch})` : ''}
                </span>
              </div>
            </div>
          </BrutalCard>

          {registration.teamName ? (
            <BrutalCard shadow>
              <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">
                Team Details
              </h2>
              <div className="mb-4">
                <p className="opacity-60 uppercase font-sans font-bold text-xs mb-1">Team Name</p>
                <p className="font-display font-black text-2xl uppercase tracking-tighter text-primary-container">
                  {registration.teamName}
                </p>
              </div>

              {members.length > 0 ? (
                <div className="space-y-4 mt-6">
                  <p className="opacity-60 uppercase font-sans font-bold text-xs">Additional Members</p>
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-surface-container-low p-3 brutal-border flex justify-between items-center text-sm font-mono gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-bold uppercase truncate">{member.name}</p>
                        <p className="text-[10px] opacity-60 uppercase truncate">
                          {member.college || 'N/A'}
                          {member.branch ? ` (${member.branch})` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="opacity-60 text-xs uppercase">{member.phone || 'No phone'}</p>
                        {member.year ? <p className="opacity-60 text-[10px] uppercase">Year {member.year}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </BrutalCard>
          ) : null}

          <div className="bg-on-surface text-surface p-8 hard-shadow-gold italic">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.3em] mb-6 text-primary-container">
              Action
            </h3>
            <div className="mb-6 border-b border-surface/20 pb-4 flex justify-between items-center">
              <span className="font-sans text-sm uppercase font-bold opacity-60">Current Status</span>
              <span
                className={`px-3 py-1 font-black uppercase text-xs not-italic ${
                  registration.status === 'APPROVED'
                    ? 'bg-green-500 text-black'
                    : registration.status === 'PENDING'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-red-500 text-black'
                }`}
              >
                {registration.status}
              </span>
            </div>

            <div className="mb-6 border-b border-surface/20 pb-4 flex justify-between items-center">
              <span className="font-sans text-sm uppercase font-bold opacity-60">Total Fee</span>
              <span className="font-black uppercase text-xl">INR {totalFee}</span>
            </div>

            <form
              action={async (formData) => {
                'use server';
                await updateRegistrationStatus(formData);
              }}
              className="space-y-4"
            >
              <input type="hidden" name="id" value={registration.id} />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-80">Admin Notes</label>
                <textarea
                  name="paymentNotes"
                  defaultValue={registration.paymentNotes ?? ''}
                  className="w-full p-3 border-2 border-surface bg-surface-container-low text-black outline-none"
                  rows={3}
                  placeholder="Add any approval or rejection notes"
                />
              </div>
              <button
                type="submit"
                name="status"
                value="APPROVED"
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest py-4 border-2 border-surface transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined mr-2">verified</span>
                Approve Registration
              </button>
              <button
                type="submit"
                name="status"
                value="REJECTED"
                className="w-full bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest py-4 border-2 border-surface transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined mr-2">dangerous</span>
                Reject Registration
              </button>
              {registration.status !== 'PENDING' ? (
                <button
                  type="submit"
                  name="status"
                  value="PENDING"
                  className="w-full bg-surface-container-low hover:bg-white text-surface font-black uppercase tracking-widest py-3 border-2 border-surface transition-colors"
                >
                  Reset to Pending
                </button>
              ) : null}
            </form>
            
            <form 
              action={async () => {
                'use server';
                await deleteRegistration(registration.id);
                redirect('/admin/registrations');
              }}
              className="mt-4"
            >
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-black uppercase tracking-widest py-4 border-2 border-surface transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined mr-2">delete</span>
                Delete Entry
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <BrutalCard shadow>
            <div className="flex justify-between items-end mb-6 border-b-2 border-on-surface pb-4 gap-6">
              <div>
                <h2 className="text-2xl font-black uppercase italic mb-1">Payment Screenshot</h2>
                <p className="font-display font-bold uppercase text-primary tracking-widest text-xs">
                  Open the image and confirm the payment details before approval.
                </p>
              </div>
              <div className="text-right">
                <p className="font-sans font-bold text-[10px] uppercase opacity-60">Transaction ID</p>
                <p className="font-mono font-black text-xl tracking-tighter uppercase">
                  {registration.transactionId || 'Free Event'}
                </p>
              </div>
            </div>

            <div className="w-full bg-surface-container-low min-h-[60vh] border-2 border-on-surface flex items-center justify-center p-2 relative">
              {registration.paymentScreenshot ? (
                <a
                  href={registration.paymentScreenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={registration.paymentScreenshot}
                    alt="Payment screenshot"
                    className="w-full h-auto object-contain brutal-border hover:opacity-80 transition-opacity cursor-zoom-in"
                    style={{ maxHeight: '70vh' }}
                  />
                </a>
              ) : (
                <div className="text-center opacity-30">
                  <span className="material-symbols-outlined text-6xl mb-4 block">image_not_supported</span>
                  <p className="font-display font-black uppercase tracking-widest">No Screenshot Uploaded</p>
                </div>
              )}
            </div>
            <p className="text-center font-bold font-sans opacity-40 uppercase text-[10px] mt-4">
              Click the screenshot to open the full image.
            </p>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
