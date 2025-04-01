import { SignedOut, SignedIn } from "@clerk/nextjs";
import UnderConstruction from "~/components/ui/construction";
import { redirect } from 'next/navigation'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <SignedOut>
        <UnderConstruction/>
      </SignedOut>
      <SignedIn>
        {redirect('/dashboard')}
      </SignedIn>
    </main>
  );
}
