'use client'
import { SignedIn, SignedOut } from "@clerk/nextjs";
import UnderConstruction from "~/components/ui/construction";

export default  function HomePage() {
  return (
    <main className="">

      <SignedOut>
        <UnderConstruction/>
      </SignedOut>
      <SignedIn>
        <button onClick={async () => { 
          const getUser = (await import("~/server/db/users/actions")).default
          await getUser()
        }}>
          Log User Data
        </button>
      </SignedIn>

      
    </main>
  );
}
