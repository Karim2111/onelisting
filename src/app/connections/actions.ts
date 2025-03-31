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
    facebook: {
      connected: userSessions.some(session => session.platform === "facebook" && session.isSessionValid),
      createdAt: userSessions.find(session => session.platform === "facebook")?.createdAt,
    },
    kijiji: {
      connected: userSessions.some(session => session.platform === "kijiji" && session.isSessionValid),
      createdAt: userSessions.find(session => session.platform === "kijiji")?.createdAt,
    },
  };
}

export async function connectMarketplace(platform: 'facebook' | 'kijiji', cookies: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const now = new Date();

  await db.insert(sessions).values({
    userId,
    platform,
    cookies: JSON.parse(cookies),
    isSessionValid: true,
    createdAt: now, 
    lastActive: now,
  }).onConflictDoUpdate({
    target: [sessions.userId, sessions.platform],
    set: {
      cookies: JSON.parse(cookies),
      isSessionValid: true,
      createdAt: now,
      lastActive: now,
    },
  });
}

export async function disconnectMarketplace(platform: 'facebook' | 'kijiji') {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await db.update(sessions)
    .set({ isSessionValid: false, lastActive: null , createdAt: null, cookies: null, expiresAt: null, ipAddress: null, userAgent: null, proxyIp: null, profileId: null})
    .where(and(
      eq(sessions.userId, userId),
      eq(sessions.platform, platform)
    ));
} 