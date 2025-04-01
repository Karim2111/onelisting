import "~/styles/globals.css";
import { Inter, Montserrat } from "next/font/google";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider"
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "OneListing",
  description: "App to list your items",
  appleWebApp: { // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#applewebapp
    title: 'OneListing',
    statusBarStyle: 'black-translucent',
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
      <html lang="en" className={`${theme} ${montserrat.variable}`} suppressHydrationWarning>
        <body className={`${inter.className} font-sans`} suppressHydrationWarning>
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