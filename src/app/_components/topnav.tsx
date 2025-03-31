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
      src="/icon0.svg"
      alt="OneListing Logo"
      width={32}
      height={32}
      className="h-8 w-8"
    />
  </Link>
);

const BrandLink = ({ href, label }: { href: string; label: string }) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <Link href={href} passHref>
          <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-montserrat font-bold tracking-tight text-2xl hover:text-primary`}>
            {label}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
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
    <nav className="flex w-full items-center justify-between border-b p-4">
      <SignedOut>
        <div className="flex flex-row items-center space-x-1">
          <LogoLink href="/" />
          <BrandLink href="/" label="OneListing" />
          <NavigationMenuComponent href="/contact" label="Contact" />
        </div>
        <div className="flex flex-row gap-4 items-center">
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-row items-center space-x-1">
          <LogoLink href="/" />
          <BrandLink href="/dashboard" label="OneListing" />
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
