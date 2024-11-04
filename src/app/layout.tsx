import "~/styles/globals.css";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider"
import UnderConstruction from "~/components/ui/construction";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "OneListing",
  description: "App to list your items",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Get theme preference server-side - properly await cookies()
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "system";

  return (
    <ClerkProvider>
      <html lang="en" className={theme} suppressHydrationWarning>
        <body className="font-sans bold" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme={theme}
            enableSystem
            disableTransitionOnChange
            storageKey="theme"
          >
            <TopNav />
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}