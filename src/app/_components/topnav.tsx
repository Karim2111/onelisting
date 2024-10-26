"use client";


import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";



export function TopNav() {

    

    return (
      <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold ">
          <div>OneListing</div>
  
          <div className="flex flex-row gap-4 items-center">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
      </nav>
    );
  }