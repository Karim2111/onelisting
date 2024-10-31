import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getmyListings } from "~/server/queries";
import ClientDashboard from "./client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const listings = await getmyListings();

  return (
    <main>
      <SignedOut>
        <div className="w-full h-full text-2xl text-center">Please Sign In</div>
      </SignedOut>
      <SignedIn>
        <ClientDashboard listings={listings} />
      </SignedIn>
    </main>
  );
}
