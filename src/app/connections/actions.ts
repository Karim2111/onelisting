"use server"

import { db } from "~/server/db";
import { sessions } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getUserConnections() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const userSessions = await db.select().from(sessions).where(eq(sessions.userId, userId));
  
  return {
    facebook: userSessions.some(session => session.platform === "facebook" && session.isSessionValid),
    kijiji: userSessions.some(session => session.platform === "kijiji" && session.isSessionValid),
  };
}

export async function connectMarketplace(platform: 'facebook' | 'kijiji', cookies: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await db.insert(sessions).values({
    userId,
    platform,
    cookies: JSON.parse(cookies),
    isSessionValid: true,
  }).onConflictDoUpdate({
    target: [sessions.userId, sessions.platform],
    set: {
      cookies: JSON.parse(cookies),
      isSessionValid: true,
      lastActive: new Date(),
    },
  });
}

export async function disconnectMarketplace(platform: 'facebook' | 'kijiji') {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await db.update(sessions)
    .set({ isSessionValid: false })
    .where(and(
      eq(sessions.userId, userId),
      eq(sessions.platform, platform)
    ));
} 