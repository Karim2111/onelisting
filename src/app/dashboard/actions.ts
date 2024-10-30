'use server'
import { db } from "~/server/db";
import { listings } from "~/server/db/schema";
import { formSchema } from "~/components/ui/listing-form";
import * as z from "zod"
import { auth } from "@clerk/nextjs/server";

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