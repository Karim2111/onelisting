'use server'
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import type {editSchema} from "~/components/modals/edit-modal"
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { PostgresError } from 'postgres';

export type MarketplaceConnections = {
  facebook: boolean;
  kijiji: boolean;
}

// Get user's marketplace connections
export async function getUserConnections(): Promise<MarketplaceConnections> {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  return {
    facebook: !!dbUser?.facebookCookies,
    kijiji: !!dbUser?.kijijiCookies,
  };
}

// Connect a marketplace by saving cookies
export async function connectMarketplace(marketplace: 'facebook' | 'kijiji', cookies: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  try {
    await db.update(users)
      .set({
        [marketplace === 'facebook' ? 'facebookCookies' : 'kijijiCookies']: cookies,
      })
      .where(eq(users.clerkId, user.id));
    
    return { success: true };
  } catch (error) {
    console.error(`Error connecting ${marketplace}:`, error);
    throw new Error(`Failed to connect ${marketplace}`);
  }
}

// Disconnect a marketplace by clearing its cookies
export async function disconnectMarketplace(marketplace: 'facebook' | 'kijiji') {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  try {
    await db.update(users)
      .set({
        [marketplace === 'facebook' ? 'facebookCookies' : 'kijijiCookies']: null,
      })
      .where(eq(users.clerkId, user.id));
    
    return { success: true };
  } catch (error) {
    console.error(`Error disconnecting ${marketplace}:`, error);
    throw new Error(`Failed to disconnect ${marketplace}`);
  }
}

// Test user object logging in console
export default async function addUserToDb() {
    const user = await currentUser()
    if (!user) {
        throw new Error("User not found")
    }
    try {
        await db.insert(users).values({
            clerkId: user.id,
            email: user.emailAddresses?.[0]?.emailAddress ?? '',
            name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
            settings: {},
        })
        console.log("User successfully added to database")
    } catch (error) {
        console.error("Error adding user to database:", error)
        throw error
    }
}

export async function syncClerkUsers() {
    try {
        const client = await clerkClient();
        const { data: clerkUsers, totalCount } = await client.users.getUserList();
        let addedCount = 0;
        let errorCount = 0;
        
        for (const clerkUser of clerkUsers) {
            try {
                await db.insert(users).values({
                    clerkId: clerkUser.id,
                    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
                    name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
                    settings: {},
                });
                addedCount++;
            } catch (error) {
                // Skip if user already exists (unique constraint on clerkId)
                const pgError = error as PostgresError;
                if (pgError.code === '23505') {
                    console.log(`User ${clerkUser.id} already exists, skipping`);
                    continue;
                }
                errorCount++;
                console.error(`Error adding user ${clerkUser.id}:`, {
                    error,
                    user: {
                        id: clerkUser.id,
                        email: clerkUser.emailAddresses[0]?.emailAddress,
                        name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`
                    }
                });
            }
        }
        return { addedCount, errorCount, total: totalCount };
    } catch (error) {
        console.error("Failed to sync users:", error);
        throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
}