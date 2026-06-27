'use server';

import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import { getRegistrationKillSwitchMessage, isRegistrationKillSwitchEnabled } from '@/lib/env';
import {
  getEventMaxParticipants,
  getEventMinParticipants,
  getEventParticipationOptions,
  isAllowedPaymentScreenshotFormat,
  isValidPhone,
  normalizeOptionalText,
  normalizePhone,
  normalizeText,
  normalizeTransactionId,
  parseYear,
  PAYMENT_SCREENSHOT_MAX_BYTES,
  resolvePerParticipantFee,
  type RegistrationSubmission,
} from '@/lib/registration';

type RegistrationActionResult =
  | { success: true }
  | { error: string; success: false };

export async function submitRegistration(formData: RegistrationSubmission): Promise<RegistrationActionResult> {
  if (!formData?.eventId) {
    return { success: false, error: 'Please select an event.' };
  }

  if (isRegistrationKillSwitchEnabled()) {
    return { success: false, error: getRegistrationKillSwitchMessage() };
  }

  const eventSnapshot = await db.collection('events').doc(formData.eventId).get();
  if (!eventSnapshot.exists) {
    return { success: false, error: 'Selected event was not found.' };
  }
  const event = { id: eventSnapshot.id, ...eventSnapshot.data() } as any;

  const settingsSnapshot = await db.collection('systemSettings').doc('1').get();
  const settings = settingsSnapshot.exists ? (settingsSnapshot.data() as any) : null;
  const registrationPaused = settings?.registrationPaused ?? false;
  if (registrationPaused) {
    return { success: false, error: 'Registrations are temporarily closed due to technical maintenance' };
  }

  const registrationOpen = settings?.registrationOpen ?? true;
  const deadline = settings?.deadline ? new Date(settings.deadline) : null;

  if (!registrationOpen || (deadline && new Date() > deadline)) {
    return { success: false, error: 'Registrations Closed' };
  }

  const participationOptions = getEventParticipationOptions(event.format);
  const effectiveTeamMode = participationOptions.requireTeam ? true : Boolean(formData.teamFormat);
  const minParticipants = getEventMinParticipants(event.format, event.teamSizeMin, effectiveTeamMode);
  const maxParticipants = getEventMaxParticipants(event.teamSize);

  if (!Array.isArray(formData.members) || formData.members.length === 0) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  if (formData.members.length < minParticipants || formData.members.length > maxParticipants) {
    return {
      success: false,
      error: effectiveTeamMode
        ? 'Team members required'
        : `This event accepts ${minParticipants}-${maxParticipants} participant(s).`,
    };
  }

  const sanitizedMembers = formData.members.map((member, index) => {
    const year = parseYear(member.year);
    const normalizedMember = {
      branch: normalizeText(member.branch || ''),
      college: normalizeText(member.college || ''),
      email: index === 0 ? normalizeOptionalText(member.email)?.toLowerCase() ?? '' : '',
      name: normalizeText(member.name || ''),
      phone: normalizePhone(member.phone || ''),
      year,
    };

    return normalizedMember;
  });

  if (
    sanitizedMembers.some(
      (member, index) =>
        !member.name ||
        !member.college ||
        !member.branch ||
        !member.year ||
        !member.phone ||
        (index === 0 && !member.email),
    )
  ) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  if (sanitizedMembers.some((member) => !isValidPhone(member.phone))) {
    return { success: false, error: 'Please enter valid phone number' };
  }

  const leader = sanitizedMembers[0];
  if (!leader) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  const resolvedTeamName = effectiveTeamMode
    ? normalizeOptionalText(formData.teamName) || `${leader.name}'s Team`
    : null;

  if (effectiveTeamMode && !resolvedTeamName) {
    return { success: false, error: 'Team members required' };
  }

  const feePerParticipant = resolvePerParticipantFee(event.fee, settings?.feePerPerson);
  const totalFee = feePerParticipant * sanitizedMembers.length;
  const requiresPayment = totalFee > 0;
  const transactionId = normalizeOptionalText(formData.transactionId)
    ? normalizeTransactionId(formData.transactionId as string)
    : null;
  const paymentScreenshot = formData.paymentScreenshot ?? null;

  if (requiresPayment && !transactionId) {
    return { success: false, error: 'Please enter the transaction ID.' };
  }

  if (requiresPayment && !paymentScreenshot?.url) {
    return { success: false, error: 'Upload payment screenshot' };
  }

  if (requiresPayment) {
    if (!isAllowedPaymentScreenshotFormat(paymentScreenshot?.format)) {
      return { success: false, error: 'Payment screenshot must be a JPG or PNG file.' };
    }

    if (!paymentScreenshot || paymentScreenshot.bytes <= 0 || paymentScreenshot.bytes > PAYMENT_SCREENSHOT_MAX_BYTES) {
      return { success: false, error: 'Payment screenshot must be 5 MB or smaller.' };
    }
  }

  let createdTeamId: string | null = null;
  let userId: string | null = null;

  try {
    const userSnapshot = await db.collection('users').where('email', '==', leader.email).limit(1).get();
    
    if (userSnapshot.empty) {
      const userRef = await db.collection('users').add({
        branch: leader.branch,
        college: leader.college,
        email: leader.email,
        name: leader.name,
        password: null,
        phone: leader.phone,
        role: 'PARTICIPANT',
        year: leader.year,
        createdAt: new Date().toISOString(),
      });
      userId = userRef.id;
    } else {
      const userDoc = userSnapshot.docs[0];
      userId = userDoc.id;
      await db.collection('users').doc(userId).update({
        branch: leader.branch,
        college: leader.college,
        name: leader.name,
        phone: leader.phone,
        year: leader.year,
      });
    }

    if (!userId) {
      return { success: false, error: 'Unable to create participant record.' };
    }

    const regSnapshot = await db.collection('registrations')
      .where('eventId', '==', event.id)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    const existingRegistration = regSnapshot.empty
      ? null
      : { id: regSnapshot.docs[0].id, ...regSnapshot.docs[0].data() } as any;

    if (existingRegistration) {
      if (existingRegistration.status !== 'REJECTED') {
        return { success: false, error: 'You have already registered for this event.' };
      }

      if (existingRegistration.teamId) {
        const teamMembersSnapshot = await db.collection('teamMembers')
          .where('teamId', '==', existingRegistration.teamId)
          .get();
        
        const batch = db.batch();
        teamMembersSnapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
        batch.delete(db.collection('teams').doc(existingRegistration.teamId));
        await batch.commit();
      }

      await db.collection('registrations').doc(existingRegistration.id).delete();
    }

    if (effectiveTeamMode) {
      const teamRef = await db.collection('teams').add({
        eventId: event.id,
        name: resolvedTeamName as string,
        createdAt: new Date().toISOString(),
      });

      createdTeamId = teamRef.id;

      if (!createdTeamId) {
        return { success: false, error: 'Unable to create the team record.' };
      }

      const extraMembers = sanitizedMembers.slice(1);
      if (extraMembers.length > 0) {
        const batch = db.batch();
        extraMembers.forEach((member) => {
          const memberRef = db.collection('teamMembers').doc();
          batch.set(memberRef, {
            branch: member.branch,
            college: member.college,
            name: member.name,
            phone: member.phone,
            teamId: createdTeamId as string,
            year: member.year,
          });
        });
        await batch.commit();
      }
    }

    await db.collection('registrations').add({
      eventId: event.id,
      members: sanitizedMembers.map((member) => ({
        branch: member.branch,
        college: member.college,
        email: member.email || null,
        name: member.name,
        phone: member.phone,
        year: member.year,
      })),
      paymentScreenshot: requiresPayment ? paymentScreenshot?.url ?? null : null,
      status: 'PENDING',
      teamId: createdTeamId,
      teamName: resolvedTeamName,
      totalFee,
      transactionId: requiresPayment ? transactionId : null,
      userId: userId,
      createdAt: new Date().toISOString(),
    });

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/registrations');
    revalidatePath('/status');

    return { success: true };
  } catch (error) {
    if (createdTeamId) {
      try {
        const teamMembersSnapshot = await db.collection('teamMembers')
          .where('teamId', '==', createdTeamId)
          .get();
        const batch = db.batch();
        teamMembersSnapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
        batch.delete(db.collection('teams').doc(createdTeamId));
        await batch.commit();
      } catch (cleanupErr) {
        console.error('Failed to clean up team on error:', cleanupErr);
      }
    }

    console.error('Registration error:', error);
    return { success: false, error: 'Server error during registration.' };
  }
}
