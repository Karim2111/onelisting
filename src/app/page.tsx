
import UnderConstruction from "~/components/ui/construction";
import { redirect } from 'next/navigation'
import { auth } from "@clerk/nextjs/server";
export default async function HomePage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-background">
      <UnderConstruction />
    </main>
  );
}
