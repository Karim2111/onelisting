"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="">
      <SignedOut>
        <div className="w-full h-full text-2xl text-center">Please Sign In</div>
      </SignedOut>
      <SignedIn>
        <div className="flex justify-center p-8">
          <Button onClick={() => router.push("/create-listing")}>
            Create Listing
          </Button>
        </div>
      </SignedIn>
    </main>
  );
}