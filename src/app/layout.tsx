import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav"

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "OneListing",
  description: "App to list your items",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en"/>
        <body  className={`${GeistSans.variable}`}>
          <TopNav />
          {children}
        </body>
    </ClerkProvider>
  );
}
