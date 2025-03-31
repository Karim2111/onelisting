import { SignedOut } from "@clerk/nextjs";
import UnderConstruction from "~/components/ui/construction";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <SignedOut>
        <UnderConstruction/>
      </SignedOut>
    </main>
  );
}
