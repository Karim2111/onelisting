import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";



export default  function HomePage() {
    return (
      <main className="">
  
        <SignedOut>
          <div className="w-full h-full text-2xl text-center">Please Sign In  NOQQQQQQQQQQQQQQQ</div>
        </SignedOut>
        <SignedIn>
        <div className="w-full h-full text-2xl text-center">WELCOME </div>
        </SignedIn>
      </main>
    );
  }
  