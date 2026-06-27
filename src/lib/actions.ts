'use server';

import { db } from '@/db';
import { Filter, FieldPath } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { awardXP, XP_PER_REGISTRATION } from './xp';
import { assertAdminAction, assertStaffAction, getActionSession } from './authz';
import {
  getNotificationCapabilities,
  getRegistrationKillSwitchMessage,
  hasAdminSetupKey,
  isRegistrationKillSwitchEnabled,
} from './env';
import { assertRateLimit, getActionIp } from './rate-limit';
import { sendNotificationCampaign } from './notifications';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}


export async function createEvent(formData: FormData) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  const name = formData.get('name') as string;
  const tagline = formData.get('tagline') as string;
  const description = formData.get('description') as string;
  const fee = parseInt(formData.get('fee') as string);
  const category = (formData.get('category') as string) || null;
  const venue = formData.get('venue') as string;
  const format = formData.get('format') as string || 'SOLO';
  const isCommon = formData.get('isCommon') === 'on';
  const teamSize = parseInt(formData.get('teamSize') as string) || 1;
  const teamSizeMin = parseInt(formData.get('teamSizeMin') as string) || 1;
  const expectedParticipantsRaw = (formData.get('expectedParticipants') as string) || null;
  const expectedParticipants = expectedParticipantsRaw ? parseInt(expectedParticipantsRaw) : null;
  const prizeDetails = (formData.get('prizeDetails') as string) || null;

  if (!name.trim()) {
    return { error: 'Event name is required.' };
  }

  if (Number.isNaN(fee) || fee < 0) {
    return { error: 'Fee must be zero or greater.' };
  }

  if (teamSizeMin > teamSize) {
    return { error: 'Min team size cannot be greater than max team size.' };
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const docRef = db.collection('events').doc();
    await docRef.set({
      id: docRef.id,
      name,
      slug,
      tagline,
      description,
      category,
      fee,
      venue,
      format,
      isCommon,
      teamSize,
      teamSizeMin,
      expectedParticipants,
      prizeDetails,
      createdAt: new Date().toISOString(),
    });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to initialize event.' };
  }
}

export async function registerUser(formData: FormData) {
  try {
    assertRateLimit({
      namespace: 'account-register',
      identifier: await getActionIp(),
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });
  } catch (error) {
    return { error: getErrorMessage(error, 'Too many requests.') };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const college = formData.get('college') as string;
  const branch = formData.get('branch') as string;
  const phone = formData.get('phone') as string;

  if (!name || !email || !password) {
    return { error: 'Missing required fields.' };
  }

  try {
    const existingUserSnap = await db.collection('users').where('email', '==', email).limit(1).get();
    if (!existingUserSnap.empty) {
      return { error: 'Email already registered.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = db.collection('users').doc();
    await docRef.set({
      id: docRef.id,
      name,
      email,
      password: hashedPassword,
      college,
      branch,
      phone,
      role: 'PARTICIPANT',
      xp: 50, // Welcome Bonus
      level: 1,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Database synchronization failed.' };
  }
}

export async function registerAdmin(formData: FormData) {
  try {
    assertRateLimit({
      namespace: 'staff-register',
      identifier: await getActionIp(),
      limit: 4,
      windowMs: 15 * 60 * 1000,
    });
  } catch (error) {
    return { error: getErrorMessage(error, 'Too many requests.') };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const requestedRole = ((formData.get('role') as string) || 'VOLUNTEER').toUpperCase();
  const setupKey = (formData.get('setupKey') as string) || '';

  if (!name || !email || !password) {
    return { error: 'Missing required credentials.' };
  }

  if (requestedRole !== 'ADMIN' && requestedRole !== 'VOLUNTEER') {
    return { error: 'Invalid role requested.' };
  }

  const session = await getActionSession();
  const isAdminSession = session?.user?.role === 'ADMIN';

  if (requestedRole === 'ADMIN' && !isAdminSession) {
    return { error: 'Only a signed-in super admin can create another super admin.' };
  }

  if (!isAdminSession) {
    if (!hasAdminSetupKey()) {
      return { error: 'ADMIN_SETUP_KEY is not configured. Ask the deployment owner to configure staff onboarding.' };
    }

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return { error: 'Invalid staff setup key.' };
    }
  }

  try {
    const existingUserSnap = await db.collection('users').where('email', '==', email).limit(1).get();
    if (!existingUserSnap.empty) {
      return { error: 'This email is already registered.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = db.collection('users').doc();
    await docRef.set({
      id: docRef.id,
      name,
      email,
      password: hashedPassword,
      role: requestedRole,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Database synchronization failed.' };
  }
}

export async function updateAnnouncement(formData: FormData) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  const content = formData.get('content') as string;
  const isActive = formData.get('isActive') === 'on';

  try {
    const announcementsSnap = await db.collection('announcements').limit(1).get();
    
    if (!announcementsSnap.empty) {
      const doc = announcementsSnap.docs[0];
      await db.collection('announcements').doc(doc.id).update({
        content,
        isActive,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const docRef = db.collection('announcements').doc();
      await docRef.set({
        id: docRef.id,
        content,
        isActive,
        updatedAt: new Date().toISOString(),
      });
    }
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update broadcast signal.' };
  }
}

export async function updateSchedules(formData: FormData) {
  await assertAdminAction();

  try {
    const entries = Array.from(formData.entries());
    
    const batch = db.batch();
    let hasUpdates = false;
    for (const [id, schedule] of entries) {
      if (id.startsWith('$ACTION')) continue;
      
      const docRef = db.collection('events').doc(id);
      batch.update(docRef, { schedule: schedule as string });
      hasUpdates = true;
    }
    if (hasUpdates) {
      await batch.commit();
    }
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/schedule');
  } catch (e) {
    console.error(e);
  }
}

export async function updateScheduleSlots(formData: FormData) {
  await assertAdminAction();

  const slotDefs = [
    { sortIndex: 1, timeSlot: '10:30 AM - 11:00 AM' },
    { sortIndex: 2, timeSlot: '11:00 AM - 01:00 PM' },
    { sortIndex: 3, timeSlot: '01:00 PM - 01:30 PM' },
    { sortIndex: 4, timeSlot: '01:30 PM - 04:00 PM' },
    { sortIndex: 5, timeSlot: '04:00 PM - 05:30 PM' },
  ];

  try {
    for (const day of [1, 2] as const) {
      for (const slot of slotDefs) {
        const isBreak = slot.sortIndex === 3;
        const linkedEventIdRaw = formData.get(`day${day}_event_${slot.sortIndex}`) as string | null;
        const linkedEventId = !linkedEventIdRaw || linkedEventIdRaw === 'null' ? null : linkedEventIdRaw;
        const venueRaw = formData.get(`day${day}_venue_${slot.sortIndex}`) as string | null;
        const venue = venueRaw && venueRaw.trim().length > 0 ? venueRaw.trim() : null;

        const existingSnap = await db
          .collection('scheduleSlots')
          .where('day', '==', day)
          .where('sortIndex', '==', slot.sortIndex)
          .limit(1)
          .get();

        if (existingSnap.empty) {
          const docRef = db.collection('scheduleSlots').doc();
          await docRef.set({
            id: docRef.id,
            day,
            sortIndex: slot.sortIndex,
            timeSlot: slot.timeSlot,
            venue,
            linkedEventId: isBreak ? null : linkedEventId,
            isBreak,
            createdAt: new Date().toISOString(),
          });
        } else {
          const existingDoc = existingSnap.docs[0];
          await db.collection('scheduleSlots').doc(existingDoc.id).update({
            timeSlot: slot.timeSlot,
            venue,
            linkedEventId: isBreak ? null : linkedEventId,
            isBreak,
          });
        }
      }
    }

    revalidatePath('/admin/schedule');
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
  } catch (e) {
    console.error(e);
  }
}

export async function deleteEvent(formData: FormData) {
  await assertAdminAction();

  const id = formData.get('id') as string;
  try {
    const regsSnap = await db.collection('registrations').where('eventId', '==', id).get();
    const batch = db.batch();
    regsSnap.docs.forEach((doc: any) => batch.delete(doc.ref));
    batch.delete(db.collection('events').doc(id));
    await batch.commit();
    revalidatePath('/');
    revalidatePath('/admin/events');
    revalidatePath('/admin/dashboard');
  } catch(e) { console.error(e); }
}

export async function updateEvent(formData: FormData) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const tagline = formData.get('tagline') as string;
  const description = formData.get('description') as string;
  const category = (formData.get('category') as string) || null;
  const venue = formData.get('venue') as string;
  const format = (formData.get('format') as string) || 'SOLO';
  const isCommon = formData.get('isCommon') === 'on';
  const prizeDetails = (formData.get('prizeDetails') as string) || null;
  
  const fee = parseInt(formData.get('fee') as string);
  const teamSize = parseInt(formData.get('teamSize') as string);
  const teamSizeMinRaw = (formData.get('teamSizeMin') as string) || null;
  const teamSizeMin = teamSizeMinRaw ? parseInt(teamSizeMinRaw) : 1;

  const expectedParticipantsRaw = (formData.get('expectedParticipants') as string) || null;
  const expectedParticipants = expectedParticipantsRaw ? parseInt(expectedParticipantsRaw) : null;

  if (!id) return { error: 'Event ID is required.' };
  if (!name?.trim()) return { error: 'Event name is required.' };

  if (Number.isNaN(fee) || fee < 0) {
    return { error: 'Fee must be a valid number (0 or greater).' };
  }

  if (Number.isNaN(teamSize) || teamSize < 1) {
    return { error: 'Max team size must be at least 1.' };
  }

  if (teamSizeMin > teamSize) {
    return { error: 'Min team size cannot be greater than max team size.' };
  }

  try {
    await db.collection('events').doc(id).update({
      name,
      tagline,
      description,
      category,
      venue,
      format,
      isCommon,
      prizeDetails,
      fee,
      teamSize,
      teamSizeMin,
      expectedParticipants,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      schedule: formData.get('schedule') as string || null,
    });

    revalidatePath('/');
    revalidatePath('/admin/events');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update event packet.' };
  }
}

export async function deleteUser(formData: FormData) {
  await assertAdminAction();

  const id = formData.get('id') as string;
  try {
    const regsSnap = await db.collection('registrations').where('userId', '==', id).get();
    const batch = db.batch();
    regsSnap.docs.forEach((doc: any) => batch.delete(doc.ref));
    batch.delete(db.collection('users').doc(id));
    await batch.commit();
    revalidatePath('/admin/users');
  } catch(e) { console.error(e); }
}

export async function updateUser(formData: FormData) {
  await assertAdminAction();

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const college = formData.get('college') as string;
  const branch = formData.get('branch') as string;
  const yearRaw = (formData.get('year') as string) || null;
  const year = yearRaw ? parseInt(yearRaw) : null;
  const phone = formData.get('phone') as string;
  const roleRaw = (formData.get('role') as string) || 'PARTICIPANT';
  const role = roleRaw === 'ADMIN' || roleRaw === 'VOLUNTEER' || roleRaw === 'PARTICIPANT' ? roleRaw : 'PARTICIPANT';
  try {
    await db.collection('users').doc(id).update({ name, college, branch, year, phone, role });
    revalidatePath('/admin/users');
  } catch (e) { console.error(e); }
}

import { redirect } from 'next/navigation';

export async function completeProfile(formData: FormData) {
  const email = formData.get('email') as string;
  const college = formData.get('college') as string;
  const branch = formData.get('branch') as string;
  const yearRaw = (formData.get('year') as string) || null;
  const year = yearRaw ? parseInt(yearRaw) : null;
  const phone = formData.get('phone') as string;
  
  if (!email || !college || !branch || !phone || !year) {
    return;
  }

  try {
    const userSnap = await db.collection('users').where('email', '==', email).limit(1).get();
    if (!userSnap.empty) {
      await db.collection('users').doc(userSnap.docs[0].id).update({ college, branch, year, phone });
    }
    revalidatePath('/dashboard');
  } catch (e) {
    console.error(e);
  }
  
  redirect('/dashboard');
}

export async function createRegistration(formData: FormData) {
  if (isRegistrationKillSwitchEnabled()) {
    return { error: getRegistrationKillSwitchMessage() };
  }

  const eventId = formData.get('eventId') as string;
  const paymentScreenshot = (formData.get('paymentScreenshot') as string) || null;
  const teamName = formData.get('teamName') as string || null;
  const transactionId = formData.get('transactionId') as string || null;
  const paymentNotes = (formData.get('paymentNotes') as string) || null;

  const additionalMembers: Array<{
    name: string;
    phone: string;
    college: string | null;
    branch: string | null;
    year: number | null;
  }> = [];

  // Additional operators (excluding the primary logged-in user).
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('member_') || !key.endsWith('_name')) continue;
    const index = key.split('_')[1];

    const name = value as string;
    const phone = (formData.get(`member_${index}_phone`) as string) || '';
    const college = (formData.get(`member_${index}_college`) as string) || null;
    const branch = (formData.get(`member_${index}_branch`) as string) || null;
    const yearRaw = (formData.get(`member_${index}_year`) as string) || null;
    const year = yearRaw ? parseInt(yearRaw) : null;

    if (!name || !phone) continue;
    additionalMembers.push({ name, phone, college, branch, year });
  }

  const session = await auth();
  if (!session?.user?.email) return { error: 'Unauthorized Protocol.' };

  const userSnap = await db.collection('users').where('email', '==', session.user.email).limit(1).get();
  if (userSnap.empty) return { error: 'Identity not found in global registry.' };
  const dbUser = { id: userSnap.docs[0].id, ...userSnap.docs[0].data() } as any;

  try {
    assertRateLimit({
      namespace: 'event-registration',
      identifier: `${await getActionIp()}:${dbUser.id}`,
      limit: 6,
      windowMs: 10 * 60 * 1000,
    });
  } catch (error) {
    return { error: getErrorMessage(error, 'Too many requests.') };
  }

  if (!dbUser.college || !dbUser.branch || !dbUser.phone || !dbUser.year) {
    return { error: 'Identity incomplete. Please complete profile (college, branch, year, phone).' };
  }

  try {
    const feeSettingsDoc = await db.collection('systemSettings').doc('1').get();
    const feeSettings = feeSettingsDoc.exists ? feeSettingsDoc.data() : null;
    const feePerPerson = feeSettings?.feePerPerson ? feeSettings.feePerPerson : 0;
    const isPaused = feeSettings?.registrationPaused;
    if (isPaused) {
      return { error: 'Registrations are temporarily closed due to technical maintenance' };
    }

    const eventSnap = await db.collection('events').doc(eventId).get();
    if (!eventSnap.exists) return { error: 'Event not found.' };
    const event = { id: eventSnap.id, ...eventSnap.data() } as any;

    const allMembers = [
      {
        name: dbUser.name,
        phone: dbUser.phone as string,
        college: dbUser.college,
        branch: dbUser.branch,
        year: dbUser.year ?? null,
      },
      ...additionalMembers,
    ];

    const memberCount = allMembers.length;
    const teamSizeMin = event.teamSizeMin ?? 1;
    const teamSizeMax = event.teamSize ?? 1;
    if (memberCount < teamSizeMin || memberCount > teamSizeMax) {
      return { error: `Invalid team size. Allowed: ${teamSizeMin}-${teamSizeMax}.` };
    }

    const resolvedTeamName = teamName || `${dbUser.name}'s Team`;
    const resolvedFeePerPerson =
      event.fee === 0
        ? 0
        : feePerPerson && feePerPerson > 0
          ? feePerPerson
          : event.fee;
    const totalFee = resolvedFeePerPerson * memberCount;
    const requiresPayment = totalFee > 0;

    if (requiresPayment && (!paymentScreenshot || !transactionId)) {
      return { error: 'Payment screenshot and transaction ID are required for paid events.' };
    }

    // Check existing registration
    const existingSnap = await db.collection('registrations')
      .where('eventId', '==', eventId)
      .where('userId', '==', dbUser.id)
      .get();
    const existing = existingSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));
    
    if (existing.length > 0) {
      if (existing[0].status === 'REJECTED') {
        // OVERWRITE PROTOCOL: Delete the rejected packet so they can retry smoothly.
        const existingTeamId = existing[0].teamId;
        
        const batch = db.batch();
        batch.delete(db.collection('registrations').doc(existing[0].id));
        if (existingTeamId) {
          const membersSnap = await db.collection('teamMembers').where('teamId', '==', existingTeamId).get();
          membersSnap.docs.forEach((doc: any) => batch.delete(doc.ref));
          batch.delete(db.collection('teams').doc(existingTeamId));
        }
        await batch.commit();
      } else {
        return { error: 'You have already deployed a packet for this event.' };
      }
    }

    const teamRef = await db.collection('teams').add({
      eventId,
      name: resolvedTeamName,
      createdAt: new Date().toISOString(),
    });
    const insertedTeam = { id: teamRef.id };

    if (additionalMembers.length > 0) {
      const batch = db.batch();
      additionalMembers.forEach((m) => {
        const memberRef = db.collection('teamMembers').doc();
        batch.set(memberRef, {
          teamId: insertedTeam.id,
          name: m.name,
          college: m.college,
          branch: m.branch,
          year: m.year ?? null,
          phone: m.phone,
        });
      });
      await batch.commit();
    }

    // Persist legacy JSON `members` for backward compatibility with existing admin UI.
    const legacyAdditionalMembers =
      additionalMembers.length > 0 ? additionalMembers.map((m) => ({ name: m.name, phone: m.phone })) : null;

    const regRef = db.collection('registrations').doc();
    await regRef.set({
      id: regRef.id,
      userId: dbUser.id,
      eventId,
      teamId: insertedTeam.id,
      teamName: resolvedTeamName,
      members: legacyAdditionalMembers,
      transactionId: requiresPayment ? transactionId : null,
      paymentScreenshot: requiresPayment ? paymentScreenshot : null,
      paymentNotes,
      totalFee,
      status: requiresPayment ? 'PENDING' : 'APPROVED',
      createdAt: new Date().toISOString(),
    });

    // Award XP for deployment
    await awardXP(dbUser.id, XP_PER_REGISTRATION);

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('REGISTRATION_FLOW_ERROR:', error);
    const message = error instanceof Error ? error.message : 'Unknown database fault';
    return { error: `CRITICAL ERROR: Registration injection failed (${message}). Please contact support if this persists.` };
  }
}

export async function createWalkInRegistration(formData: FormData) {
  try {
    await assertStaffAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Staff access required.') };
  }

  const eventId = (formData.get('eventId') as string) || '';
  const name = (formData.get('name') as string) || '';
  const phone = (formData.get('phone') as string) || '';
  const emailInput = ((formData.get('email') as string) || '').trim().toLowerCase();
  const college = ((formData.get('college') as string) || 'Walk-In Participant').trim();
  const branch = ((formData.get('branch') as string) || 'Desk Entry').trim();
  const yearRaw = (formData.get('year') as string) || '1';
  const parsedYear = parseInt(yearRaw, 10);
  const year = Number.isNaN(parsedYear) ? 1 : parsedYear;
  const teamNameInput = ((formData.get('teamName') as string) || '').trim();
  const paymentMode = (((formData.get('paymentMode') as string) || 'CASH').trim().toUpperCase());
  const paymentNotesInput = ((formData.get('paymentNotes') as string) || '').trim();
  const membersText = ((formData.get('members') as string) || '').trim();

  if (!eventId || !name.trim() || !phone.trim()) {
    return { error: 'Event, name, and phone are required for desk registration.' };
  }

  const additionalMembers = membersText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [memberName = '', memberPhone = ''] = line.split('|').map((part) => part.trim());
      return {
        name: memberName,
        phone: memberPhone,
      };
    })
    .filter((member) => member.name);

  try {
    const eventSnap = await db.collection('events').doc(eventId).get();

    if (!eventSnap.exists) {
      return { error: 'Selected event was not found.' };
    }
    const event = { id: eventSnap.id, ...eventSnap.data() } as any;

    const memberCount = 1 + additionalMembers.length;
    const minTeamSize = event.teamSizeMin ?? 1;
    const maxTeamSize = event.teamSize ?? 1;

    if (memberCount < minTeamSize || memberCount > maxTeamSize) {
      return { error: `This event accepts ${minTeamSize}-${maxTeamSize} participant(s).` };
    }

    const normalizedEmail =
      emailInput || `walkin-${phone.replace(/[^\d]/g, '') || Date.now()}@kratos.local`;

    const existingUserSnap = await db.collection('users')
      .where(
        Filter.or(
          Filter.where('email', '==', normalizedEmail),
          Filter.where('phone', '==', phone.trim())
        )
      )
      .limit(1)
      .get();
    const existingUser = existingUserSnap.empty ? null : { id: existingUserSnap.docs[0].id, ...existingUserSnap.docs[0].data() } as any;

    let userRecord: any;
    if (existingUser) {
      userRecord = existingUser;
    } else {
      const userRef = db.collection('users').doc();
      const userData = {
        id: userRef.id,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        college,
        branch,
        year,
        role: 'PARTICIPANT',
        xp: 0,
        level: 1,
        createdAt: new Date().toISOString(),
      };
      await userRef.set(userData);
      userRecord = userData;
    }

    if (!userRecord) {
      return { error: 'Unable to create the walk-in participant record.' };
    }

    await db.collection('users').doc(userRecord.id).update({
      name: userRecord.name || name.trim(),
      phone: userRecord.phone || phone.trim(),
      college: userRecord.college || college,
      branch: userRecord.branch || branch,
      year: userRecord.year || year,
    });

    const existingRegistrationSnap = await db.collection('registrations')
      .where('userId', '==', userRecord.id)
      .where('eventId', '==', eventId)
      .limit(1)
      .get();

    if (!existingRegistrationSnap.empty) {
      return { error: 'This participant is already registered for the selected event.' };
    }

    const resolvedTeamName =
      teamNameInput || (memberCount > 1 ? `${name.trim()} Desk Team` : `${name.trim()} Solo Entry`);

    const teamRef = await db.collection('teams').add({
      eventId,
      name: resolvedTeamName,
      createdAt: new Date().toISOString(),
    });
    const insertedTeam = { id: teamRef.id };

    if (!insertedTeam) {
      return { error: 'Unable to create the walk-in team record.' };
    }

    if (additionalMembers.length > 0) {
      const batch = db.batch();
      additionalMembers.forEach((member) => {
        const memberRef = db.collection('teamMembers').doc();
        batch.set(memberRef, {
          teamId: insertedTeam.id,
          name: member.name,
          phone: member.phone || null,
          college,
          branch,
          year,
        });
      });
      await batch.commit();
    }

    const totalFee = (event.fee || 0) * memberCount;
    const paymentNotes = ['Desk registration', `Payment mode: ${paymentMode}`, paymentNotesInput]
      .filter(Boolean)
      .join(' | ');

    const regRef = db.collection('registrations').doc();
    await regRef.set({
      id: regRef.id,
      userId: userRecord.id,
      eventId,
      teamId: insertedTeam.id,
      teamName: resolvedTeamName,
      members:
        additionalMembers.length > 0
          ? additionalMembers.map((member) => ({ name: member.name, phone: member.phone || null }))
          : null,
      transactionId: totalFee > 0 ? `DESK-${paymentMode}-${Date.now()}` : null,
      paymentNotes,
      totalFee,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
    });
    const registration = { id: regRef.id };

    revalidatePath('/admin/desk');
    revalidatePath('/admin/registrations');
    revalidatePath('/admin/registrations');
    revalidatePath('/admin/dashboard');

    return {
      success: true,
      registrationId: registration?.id ?? null,
      participantName: userRecord.name,
    };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error, 'Desk registration failed.') };
  }
}

export async function sendOperationalNotification(formData: FormData) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  const subject = ((formData.get('subject') as string) || 'KRATOS 2026 Update').trim();
  const message = ((formData.get('message') as string) || '').trim();
  const audience = ((formData.get('audience') as string) || 'APPROVED').trim().toUpperCase();
  const eventId = ((formData.get('eventId') as string) || '').trim();
  const sendEmail = formData.get('sendEmail') === 'on';
  const sendWhatsapp = formData.get('sendWhatsapp') === 'on';

  if (!message) {
    return { error: 'Notification message is required.' };
  }

  if (!sendEmail && !sendWhatsapp) {
    return { error: 'Select at least one delivery channel.' };
  }

  const capabilities = getNotificationCapabilities();

  if (sendEmail && !capabilities.email) {
    return { error: 'SMTP configuration is missing. Email delivery is not available yet.' };
  }

  if (sendWhatsapp && !capabilities.whatsapp) {
    return { error: 'Twilio WhatsApp configuration is missing. WhatsApp delivery is not available yet.' };
  }

  try {
    let recipients: Array<{ email: string | null; phone: string | null }> = [];

    if (audience === 'ALL_USERS') {
      const usersSnap = await db.collection('users').where('role', '==', 'PARTICIPANT').get();
      recipients = usersSnap.docs.map((doc: any) => {
        const data = doc.data();
        return { email: data.email ?? null, phone: data.phone ?? null };
      });
    } else if (audience === 'EVENT') {
      if (!eventId) {
        return { error: 'Choose an event when targeting event participants.' };
      }

      const regsSnap = await db.collection('registrations').where('eventId', '==', eventId).get();
      const userIds = Array.from(new Set(regsSnap.docs.map((doc: any) => doc.data().userId).filter(Boolean)));
      const usersList: any[] = [];
      if (userIds.length > 0) {
        const chunkSize = 30;
        for (let i = 0; i < userIds.length; i += chunkSize) {
          const chunk = userIds.slice(i, i + chunkSize);
          const usersSnap = await db.collection('users').where(FieldPath.documentId(), 'in', chunk).get();
          usersSnap.docs.forEach((doc: any) => usersList.push(doc.data()));
        }
      }
      recipients = usersList.map(user => ({ email: user.email ?? null, phone: user.phone ?? null }));
    } else {
      const regsSnap = await db.collection('registrations').where('status', '==', 'APPROVED').get();
      const userIds = Array.from(new Set(regsSnap.docs.map((doc: any) => doc.data().userId).filter(Boolean)));
      const usersList: any[] = [];
      if (userIds.length > 0) {
        const chunkSize = 30;
        for (let i = 0; i < userIds.length; i += chunkSize) {
          const chunk = userIds.slice(i, i + chunkSize);
          const usersSnap = await db.collection('users').where(FieldPath.documentId(), 'in', chunk).get();
          usersSnap.docs.forEach((doc: any) => usersList.push(doc.data()));
        }
      }
      recipients = usersList.map(user => ({ email: user.email ?? null, phone: user.phone ?? null }));
    }

    if (recipients.length === 0) {
      return { error: 'No matching recipients were found for this notification.' };
    }

    const result = await sendNotificationCampaign({
      subject,
      message,
      emails: recipients.map((recipient) => recipient.email || ''),
      phones: recipients.map((recipient) => recipient.phone || ''),
      sendEmail,
      sendWhatsapp,
    });

    return {
      success: true,
      emailSent: result.emailSent,
      whatsappSent: result.whatsappSent,
      failureCount: result.failures.length,
      failures: result.failures,
    };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error, 'Notification dispatch failed.') };
  }
}

export async function updateRegistrationStatus(formData: FormData) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  const id = formData.get('id') as string;
  const status = formData.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED';
  const paymentNotes = (formData.get('paymentNotes') as string) || null;
  try {
    await db.collection('registrations').doc(id).update({ status, paymentNotes });
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/registrations');
    revalidatePath(`/admin/verify/${id}`);
    revalidatePath('/status');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update registration status.' };
  }
}

export async function bulkUpdateRegistrationStatus(ids: string[], status: 'APPROVED' | 'REJECTED') {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  try {
    const batch = db.batch();
    ids.forEach((id) => {
      batch.update(db.collection('registrations').doc(id), { status });
    });
    await batch.commit();

    revalidatePath('/admin/registrations');
    revalidatePath('/admin/dashboard');
    revalidatePath('/status');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to perform bulk update.' };
  }
}

export async function bulkDeleteRegistrations(ids: string[]) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  try {
    for (const id of ids) {
      const existingDoc = await db.collection('registrations').doc(id).get();
      if (!existingDoc.exists) continue;
      const existing = existingDoc.data() as any;

      const existingTeamId = existing.teamId;
      
      const batch = db.batch();
      
      // Delete team messages
      const msgsSnap = await db.collection('teamMessages').where('registrationId', '==', id).get();
      msgsSnap.docs.forEach((doc: any) => batch.delete(doc.ref));
      
      // Delete registration itself
      batch.delete(db.collection('registrations').doc(id));

      if (existingTeamId) {
        const membersSnap = await db.collection('teamMembers').where('teamId', '==', existingTeamId).get();
        membersSnap.docs.forEach((doc: any) => batch.delete(doc.ref));
        batch.delete(db.collection('teams').doc(existingTeamId));
      }
      
      await batch.commit();
    }

    revalidatePath('/admin/registrations');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to perform bulk deletion.' };
  }
}

export async function deleteRegistration(id: string) {
  return bulkDeleteRegistrations([id]);
}

export async function updateGalleryLock(isGalleryLocked: boolean) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  try {
    await db.collection('systemSettings').doc('1').set({ id: 1, isGalleryLocked }, { merge: true });
    revalidatePath('/admin/dashboard');
    revalidatePath('/dashboard');
    revalidatePath('/gallery');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to flip master gallery lock.' };
  }
}

export async function updateSystemImage(field: 'heroImage' | 'aboutImage1' | 'aboutImage2' | 'aboutImage3', imageUrl: string) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  try {
    await db.collection('systemSettings').doc('1').set({ id: 1, [field]: imageUrl }, { merge: true });
    revalidatePath('/admin/settings');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: `Failed to update ${field}` };
  }
}

export async function uploadGalleryPhoto(imageUrl: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: 'Unauthorized sequence.' };

  const userSnap = await db.collection('users').where('email', '==', session.user.email).limit(1).get();
  if (userSnap.empty) return { error: 'Identity fragmented.' };
  const dbUser = { id: userSnap.docs[0].id, ...userSnap.docs[0].data() } as any;

  const settingsDoc = await db.collection('systemSettings').doc('1').get();
  const settings = settingsDoc.exists ? settingsDoc.data() : null;
  if (settings && settings.isGalleryLocked) {
    return { error: 'Admin has locked the Gallery.' };
  }

  const existingPhotosSnap = await db.collection('galleryPhotos').where('userId', '==', dbUser.id).get();
  if (existingPhotosSnap.size >= 4) {
    return { error: 'Maximum optical capacity reached (4 photos limit).' };
  }

  try {
    const docRef = db.collection('galleryPhotos').doc();
    await docRef.set({
      id: docRef.id,
      userId: dbUser.id,
      imageUrl,
      createdAt: new Date().toISOString(),
    });
    revalidatePath('/dashboard');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to upload photo.' };
  }
}

export async function deleteGalleryPhoto(id: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: 'Unauthorized sequence.' };

  const userSnap = await db.collection('users').where('email', '==', session.user.email).limit(1).get();
  if (userSnap.empty) return { error: 'Identity fragmented.' };
  const dbUser = { id: userSnap.docs[0].id, ...userSnap.docs[0].data() } as any;

  try {
    // Safety check - Can only delete if user owns the photo
    const photoDoc = await db.collection('galleryPhotos').doc(id).get();
    if (photoDoc.exists && photoDoc.data()?.userId === dbUser.id) {
      await db.collection('galleryPhotos').doc(id).delete();
    }
    revalidatePath('/dashboard');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Data purge failed.' };
  }
}

export async function updateResultsSettings(formData: FormData) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  const revealTimeStr = formData.get('revealTime') as string;
  const videoUrl = formData.get('videoUrl') as string;
  
  const revealTime = revealTimeStr ? new Date(revealTimeStr).toISOString() : null;

  try {
    await db.collection('systemSettings').doc('1').set({ 
      id: 1, 
      resultsRevealTime: revealTime, 
      resultsVideoUrl: videoUrl 
    }, { merge: true });
    revalidatePath('/admin/results');
    revalidatePath('/leaderboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to reprogram timeline.' };
  }
}

export async function updateRegistrationSettings(formData: FormData) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  const isSiteLocked = formData.get('isSiteLocked') === 'on';
  const registrationOpen = formData.get('registrationOpen') === 'on';
  const registrationPaused = formData.get('registrationPaused') === 'on';
  const upiId = (formData.get('upiId') as string) || null;
  const feePerPersonRaw = formData.get('feePerPerson') as string;
  const feePerPerson = feePerPersonRaw ? parseInt(feePerPersonRaw) : 0;
  const deadlineRaw = (formData.get('deadline') as string) || '';
  const deadline = deadlineRaw ? new Date(deadlineRaw).toISOString() : null;

  if (Number.isNaN(feePerPerson) || feePerPerson < 0) {
    return { error: 'Fee per person must be zero or greater.' };
  }

  try {
    await db.collection('systemSettings').doc('1').set({
      id: 1,
      isSiteLocked,
      registrationOpen,
      registrationPaused,
      upiId,
      feePerPerson,
      deadline,
    }, { merge: true });

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/settings');
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
}

export async function createOrganizer(formData: FormData) {
  await assertAdminAction();

  const organizerName = (formData.get('organizerName') as string) || '';
  const role = (formData.get('role') as string) || null;
  const contact = (formData.get('contact') as string) || null;
  const imageUrl = (formData.get('imageUrl') as string) || null;
  const description = (formData.get('description') as string) || null;
  const department = (formData.get('department') as string) || null;
  const linkedin = (formData.get('linkedin') as string) || null;
  const instagram = (formData.get('instagram') as string) || null;
  const sortOrderRaw = (formData.get('sortOrder') as string) || '0';
  const sortOrder = parseInt(sortOrderRaw) || 0;

  if (!organizerName.trim()) {
    return;
  }

  try {
    const docRef = db.collection('organizers').doc();
    await docRef.set({
      id: docRef.id,
      organizerName: organizerName.trim(),
      role: role ? role.trim() : null,
      contact: contact ? contact.trim() : null,
      imageUrl: imageUrl ? imageUrl.trim() : null,
      description: description ? description.trim() : null,
      department: department ? department.trim() : null,
      linkedin: linkedin ? linkedin.trim() : null,
      instagram: instagram ? instagram.trim() : null,
      sortOrder,
      createdAt: new Date().toISOString(),
    });
    revalidatePath('/admin/organizers');
    revalidatePath('/organizers');
  } catch (error) {
    console.error(error);
  }
}

export async function updateOrganizer(formData: FormData) {
  await assertAdminAction();

  const id = formData.get('id') as string;
  const organizerName = (formData.get('organizerName') as string) || '';
  const role = (formData.get('role') as string) || null;
  const contact = (formData.get('contact') as string) || null;
  const imageUrl = (formData.get('imageUrl') as string) || null;
  const description = (formData.get('description') as string) || null;
  const department = (formData.get('department') as string) || null;
  const linkedin = (formData.get('linkedin') as string) || null;
  const instagram = (formData.get('instagram') as string) || null;
  const sortOrderRaw = (formData.get('sortOrder') as string) || '0';
  const sortOrder = parseInt(sortOrderRaw) || 0;

  if (!id || !organizerName.trim()) {
    return;
  }

  try {
    await db.collection('organizers').doc(id).update({
      organizerName: organizerName.trim(),
      role: role ? role.trim() : null,
      contact: contact ? contact.trim() : null,
      imageUrl: imageUrl ? imageUrl.trim() : null,
      description: description ? description.trim() : null,
      department: department ? department.trim() : null,
      linkedin: linkedin ? linkedin.trim() : null,
      instagram: instagram ? instagram.trim() : null,
      sortOrder,
    });
    revalidatePath('/admin/organizers');
    revalidatePath('/organizers');
  } catch (error) {
    console.error(error);
  }
}

export async function deleteOrganizer(formData: FormData) {
  await assertAdminAction();

  const id = formData.get('id') as string;
  try {
    await db.collection('organizers').doc(id).delete();
    revalidatePath('/admin/organizers');
    revalidatePath('/organizers');
  } catch (error) {
    console.error(error);
  }
}

export async function updateEventWinners(eventId: string, winners: unknown) {
  try {
    await assertAdminAction();
  } catch (error) {
    return { error: getErrorMessage(error, 'Unauthorized. Admin access required.') };
  }

  try {
    await db.collection('events').doc(eventId).update({ winners });
    revalidatePath('/admin/results');
    revalidatePath('/leaderboard');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to inject winner data.' };
  }
}

export async function createSquadPost(formData: FormData) {
  const eventId = formData.get('eventId') as string;
  const bio = formData.get('bio') as string;

  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized sequence.' };

  try {
    const docRef = db.collection('squadPosts').doc();
    await docRef.set({
      id: docRef.id,
      userId: session.user.id,
      eventId,
      bio,
      createdAt: new Date().toISOString(),
    });
    revalidatePath('/squads');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to broadcast recruitment signal.' };
  }
}

export async function deleteSquadPost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized sequence.' };

  try {
    const postDoc = await db.collection('squadPosts').doc(postId).get();
    if (postDoc.exists && postDoc.data()?.userId === session.user.id) {
      await db.collection('squadPosts').doc(postId).delete();
    }
    revalidatePath('/squads');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to purge recruitment signal.' };
  }
}

export async function sendTeamMessage(registrationId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized sequence.' };

  try {
    // Verify membership
    const regDoc = await db.collection('registrations').doc(registrationId).get();
    if (!regDoc.exists) return { error: 'Team event not found.' };

    const docRef = db.collection('teamMessages').doc();
    await docRef.set({
      id: docRef.id,
      registrationId,
      senderId: session.user.id,
      content,
      createdAt: new Date().toISOString(),
    });
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to transmit team messages.' };
  }
}
