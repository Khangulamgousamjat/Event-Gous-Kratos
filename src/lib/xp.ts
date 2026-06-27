import { db } from '@/db';

/**
 * Progression Constants
 */
export const XP_PER_REGISTRATION = 100;
export const XP_PER_LEVEL = 200;

/**
 * Calculates current level and progress based on total XP
 * @param xp Total XP points
 */
export function getPlayerRank(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentLevelXp = xp % XP_PER_LEVEL;
  const progressPercent = (currentLevelXp / XP_PER_LEVEL) * 100;
  
  return {
    level,
    xpInLevel: currentLevelXp,
    xpToNextLevel: XP_PER_LEVEL,
    progressPercent
  };
}

/**
 * Awards XP to a user and handles potential level-up
 * @param userId User UUID
 * @param amount XP amount to award
 */
export async function awardXP(userId: string, amount: number) {
  const userDoc = await db.collection('users').doc(userId).get();
  if (!userDoc.exists) return;
  const user = userDoc.data() as any;

  const newXp = (user.xp || 0) + amount;
  const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

  await db.collection('users').doc(userId).update({ 
    xp: newXp,
    level: newLevel
  });
    
  return { xp: newXp, level: newLevel };
}
