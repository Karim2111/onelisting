"use client";


import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "~/components/ui/navigation-menu"



export function TopNav() {

    return (
      <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold ">
        <SignedOut>
            <div className="flex flex-row space-x-2.5" >
              <Link href="/" passHref>
                <img src="https://utfs.io/f/ybCIypRjWKiDxSehYiysKGQ7hXMO0EpJTBmb8Wzf1crCH2et"  className="h-12 w-12" />
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        OneListing
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <SignInButton />
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-row p-2" >
              <Link href="/dashboard" passHref>
                <img src="https://utfs.io/f/ybCIypRjWKiDxSehYiysKGQ7hXMO0EpJTBmb8Wzf1crCH2et"  className="h-12 w-12" />
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/dashboard" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        OneListing
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <UserButton />
            </div>
            </SignedIn>
          </nav>
    );
  }