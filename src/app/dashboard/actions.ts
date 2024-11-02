'use server'
import { db } from "~/server/db";
import { listings } from "~/server/db/schema";
import { formSchema } from "~/components/ui/listing-form";
import * as z from "zod"
import { auth } from "@clerk/nextjs/server";
import {editSchema} from "~/components/modals/edit-modal"
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";


export async function insertListingToDb(formValues: z.infer < typeof formSchema >) {
    const user = await auth()
    await db.insert(listings).values(
        {userId: user.userId,
        title: formValues.title,
        images: {
          "1": formValues.photos
        },
        price: formValues.price,
        sku: formValues.sku,
        condition: formValues.condition,
        category: formValues.category,
        description: formValues.description,
        tags: {
          "1": formValues.tags
        }, // form collects array of strings
        }
      )
  
}

export async function updateListing(formValues: z.infer<typeof editSchema>) {
  const user = await auth();
  const id = formValues.id 
  // Update only fields in `editSchema`
  await db.update(listings)
    .set({
      title: formValues.title,
      price: formValues.price,
      sku: formValues.sku,
      condition: formValues.condition,
      description: formValues.description,
      updatedAt: new Date()
    })
    .where(eq(listings.id, id));
    redirect("/dashboard")
    // Ensure the listing belongs to the authenticated user
}
