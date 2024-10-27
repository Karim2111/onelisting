import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getmyListings } from "~/server/queries";
import ClientDashboard from "./client";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch listings data on the server side
  const listings = await getmyListings();

  return (
    <main>
      <SignedOut>
        <div className="w-full h-full text-2xl text-center">Please Sign In</div>
      </SignedOut>
      <SignedIn>
        {/* Pass the listings to the client-side component */}
        <ClientDashboard listings={listings} />
      </SignedIn>
    </main>
  );
}