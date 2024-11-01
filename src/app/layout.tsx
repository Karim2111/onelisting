import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider"

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
      <html lang="en">
        <body className="font-sans bold">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <TopNav />
          {children}
          <Toaster /> {/* Add this to render the toasts */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}