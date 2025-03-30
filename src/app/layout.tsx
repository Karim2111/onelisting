import "~/styles/globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider"
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "OneListing",
  description: "App to list your items",
  appleWebApp: {
    title: "OneListing", // ⬅️ this becomes: <meta name="apple-mobile-web-app-title" content="OneListing" />
  },
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
            <SignedIn>
              <TopNav />
            </SignedIn>
            
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}