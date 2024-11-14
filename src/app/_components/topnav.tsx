"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "~/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

const LogoLink = ({ href }: { href: string }) => (
  <Link href={href} passHref>
    <Image
      src="https://utfs.io/f/ybCIypRjWKiDxSehYiysKGQ7hXMO0EpJTBmb8Wzf1crCH2et"
      alt="OneListing Logo"
      width={48} // Set width as needed
      height={48} // Set height as needed
      className="h-12 w-12"
    />
  </Link>
);

const NavigationMenuComponent = ({ href, label }: { href: string; label: string }) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <Link href={href} passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {label}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <SignedOut>
        <div className="flex flex-row space-x-2.5">
          <LogoLink href="/" />
          <NavigationMenuComponent href="/" label="OneListing" />
          <NavigationMenuComponent href="/contact" label="Contact" />
        </div>
        <div className="flex flex-row gap-4 items-center">
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-row p-2">
          <LogoLink href="/" />
          <NavigationMenuComponent href="/dashboard" label="OneListing" />
        </div>
        <div className="flex flex-row gap-4 items-center">
          <NavigationMenuComponent href="/contact" label="Contact" />
          <ModeToggle />
          <UserButton />
        </div>
      </SignedIn>
    </nav>
  );
}
