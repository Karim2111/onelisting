"use server"
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { listings } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Listing } from "~/app/dashboard/client";

export async function getmyListings(): Promise<Listing[]> {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const listings = await db.query.listings.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });

  // Transform each listing's images and tags fields
  const transformedListings = listings.map((listing) => {
    // Type assertions to safely access nested fields
    const images = listing.images as { "1": string[] } | null;
    const tags = listing.tags as { "1": string[] } | null;

    if (!images || !Array.isArray(images["1"])) {
      throw new Error("Invalid data type for images or tags");
    }
    if (!tags) {
        return {
            ...listing,
            images: images["1"], // Convert to string[]
            tags: null, // Convert to string[]
          };;
    }

    return {
      ...listing,
      images: images["1"], // Convert to string[]
      tags: tags["1"], // Convert to string[]
    };
  });

  return transformedListings;
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

export async function deleteListing(id: number): Promise<void> {
    const user = await auth();
    if (!user.userId) throw new Error("Unauthorized");
  
    await db
      .delete(listings)
      .where(and(eq(listings.id, id), eq(listings.userId, user.userId)));
  
    redirect("/dashboard");
  }