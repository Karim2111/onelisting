import { Mail } from "lucide-react";
import { Shell } from "../shells/shell";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import IntegrationShowcase from "./integration-showcase";
import BetaTesterWaitlist from "./beta-tester-waitlist";

export default function UnderConstruction() {
  return (
    <Shell variant="centered">
      <div className="flex flex-col min-h-[100dvh]">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex items-center space-x">
                  <Image
                    src="/icon0.svg"
                    alt="OneListing Logo"
                    width={256} // Adjust size if needed
                    height={256}
                    className="h-16 w-16 p-1 md:h-20 md:w-20 md:p-2 lg:h-24 lg:w-24 lg:p-3"
                  />
                  <h2 className="font-bold tracking-tight text-4xl md:text-5xl">
                    OneListing
                  </h2>
                </div>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Crosslisting for Canadians
                </p>
                <br/><br/>
                <IntegrationShowcase/>
                <br/>
                <BetaTesterWaitlist/>
                <a
                  href="mailto:contact@onelisting.com"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-muted-foreground h-10 px-4 py-2"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact us at contact@onelisting.com
                </a>
              </div>
            </div>
          </section>
        </main>
        <SignInButton>
          <p className="text-xs text-gray-500 dark:text-gray-400">Dev</p>  
        </SignInButton>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 Supreqm Inc. All rights reserved. 
          </p>
          
          
        </footer>
      </div>
    </Shell>
  );
}