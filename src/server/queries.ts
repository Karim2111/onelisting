import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { listings } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";


export async function getmyListings() {
    const user = await auth();
    if (!user.userId) throw new Error("Unauthorized");
    const listings = await db.query.listings.findMany({
      where: (model, { eq }) => eq(model.userId, user.userId),
      orderBy: (model, { desc }) => desc(model.id),
    }); 
    return listings;
  }

export async function getListing(id: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const listing = await db.query.listings.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  if (!listing) throw new Error("Listing not found");

  if (listing.userId !== user.userId) throw new Error("Unauthorized");

  return listing;
}

export async function deleteListing(id: number) {
    const user = await auth();
    if (!user.userId) throw new Error("Unauthorized");
  
    await db
      .delete(listings)
      .where(and(eq(listings.id, id), eq(listings.userId, user.userId)));
  
    redirect("/dashboard");
  }