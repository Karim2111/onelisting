import { SignedIn, SignedOut } from "@clerk/nextjs";
import MyForm from "~/components/ui/listing-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button";
import { getmyListings } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Listings() {
  const listings = await getmyListings();
  
  return (
    <div className="flex justify-center flex-col gap-4 p-4">
    {listings.map((listing) => (
        <div key={listing.id} className="flex flex-row gap-2">
          <div className="text-xl font-semibold">{listing.title}</div>
          <div className="text-lg">${listing.price}</div>
          <div className="text-lg">{listing.sku}</div>
          <div className="text-lg">{listing.condition}</div>
          <div className="text-lg">{listing.category}</div>
          <div className="text-lg">{listing.description}</div>
        </div>
    ))}
    </div>
  )
}
export default function DashboardPage() {
    return (
      <main className="">
        <SignedOut>

          <div className="w-full h-full text-2xl text-center">Please Sign In</div>
        </SignedOut>
        <SignedIn>
          <div className="flex justify-center p-8">
            <Dialog>
                <DialogTrigger asChild>
                <Button variant="outline">Create Listing</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Create Listing</DialogTitle>
                    <DialogDescription>
                    <MyForm/>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
          </div>
          <Listings />
        </SignedIn>
      </main>
    );
  }
  