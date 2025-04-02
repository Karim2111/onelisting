import { NextResponse } from "next/server";
import { z } from 'zod';
import { db } from "~/server/db";
import { listings, sessions } from "~/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

const postListingSchema = z.object({
  listingId: z.string(),
  sessionIds: z.array(z.string()).min(1, { message: "At least one Marketplace connection is required" }),
});

export async function POST(req: Request ) {
    try {
        console.log("API route called - start processing");
        
        // Authenticate the request
        const session = await auth();
        console.log("Auth result:", session?.userId ? "User authenticated" : "Authentication failed");
        
        if (!session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.userId;

        // Input Validation
        let body;
        try {
            body = await req.json() as { listingId: string, sessionIds: string[] };
            console.log("Request body:", body);
        } catch (e) {
            console.error("JSON parsing error:", e);
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        
        const validationResult = postListingSchema.safeParse(body);
        console.log("Validation result:", validationResult.success ? "Valid" : "Invalid");
        
        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.message }, { status: 400 });
        }

        const { listingId, sessionIds } = validationResult.data;
        console.log(`Processing listingId: ${listingId}, sessionIds:`, sessionIds);

        // Check if the listing belongs to the user
        const listings_result = await db
        .select({ id: listings.id })
        .from(listings)
        .where(and(eq(listings.id, parseInt(listingId)), eq(listings.userId, userId)));
        
        console.log("Listings query result:", listings_result);

        // FIX: Check if the array is empty
        if (listings_result.length === 0) {
            return NextResponse.json({ error: "Listing not found or you do not have permission." }, { status: 404 });
        }

        // Check if all sessions belong to the user
        const connections = await db
        .select({ id: sessions.id })
        .from(sessions)
        .where(and(inArray(sessions.id, sessionIds.map(Number)), eq(sessions.userId, userId)));
        
        console.log("Sessions query result:", connections);
        
        if (connections.length !== sessionIds.length) {
            return NextResponse.json({ error: "One or more marketplace connections not found or you do not have permission." }, { status: 400 });
        }

        // Environment variable check
        const workerUrl = process.env.AUTOMATION_WORKER_URL;
        const internalApiKey = process.env.INTERNAL_API_KEY;
        console.log("Environment variables:", { 
            workerUrl: workerUrl ? "Set" : "Missing",
            internalApiKey: internalApiKey ? "Set" : "Missing"
        });

        if (!workerUrl || !internalApiKey) {
            console.error("Automation worker URL or internal API key is not set.");
            return NextResponse.json({ error: "Internal server configuration error." }, { status: 500 });
        }

        const postEndpoint = `${workerUrl}/api/listings/post`;
        const postWorkerPayload = {
            listingId: parseInt(listingId),
            sessionIds: sessionIds.map(Number),
        };
        console.log(`Sending request to worker at ${postEndpoint} with payload:`, postWorkerPayload);

        
        const postWorkerResponse = await fetch(postEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-internal-api-key': internalApiKey,
            },
            body: JSON.stringify(postWorkerPayload),
        });

        // Handle the response from the worker

        if (!postWorkerResponse.ok) {
            try {
                const errorJson = await postWorkerResponse.json() as { error: string }; // TODO: Add type for worker result
                console.error(`Error response from worker:`, errorJson)
                
            } catch (e) {
                // Ignore if response is not JSON
                console.error(`Worker responded with status ${postWorkerResponse.status} and error`, e);
            }
            return NextResponse.json({ error: "Internal Server error" }, { status: 502 }); // 502 Bad Gateway might be appropriate
        }

        const workerResult = await postWorkerResponse.json() as { success: boolean, message?: string, taskId?: string }; // TODO: Add type for worker result
        console.log('Task successfully sent to worker:', workerResult);

        return NextResponse.json({
            message: "Listing posted successfully",
            taskId: workerResult?.taskId,
        }, { status: 202 }); // 202 Accepted is good if the task runs asynchronously
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON response from worker" }, { status: 400 });
        }
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}