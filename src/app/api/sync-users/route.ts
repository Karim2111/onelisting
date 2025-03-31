import { auth } from "@clerk/nextjs/server"; // assumes you use Clerk auth
import { syncClerkUsers } from "~/server/db/users/actions";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Optional: restrict to specific admin user IDs
  const adminIds = ["user_2nwm8MhI2RxosOO9UJYWKzywAHr"]; // replace with actual Clerk user IDs
  if (!adminIds.includes(userId)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const result = await syncClerkUsers();
    console.log('Sync completed:', result);  // Add detailed logging
    return Response.json({
      ...result,
      message: 'Sync completed successfully'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error('Sync users error:', {
      message: errorMessage,
      error: error
    });
    return new Response(errorMessage, { status: 500 });
  }
}