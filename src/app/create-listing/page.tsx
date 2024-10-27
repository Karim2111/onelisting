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


export default  function HomePage() {
    return (
      <main className="">
        <SignedOut>

          <div className="w-full h-full text-2xl text-center">Please Sign In</div>
        </SignedOut>
        <SignedIn>
        <Dialog>
            <DialogTrigger>Create Listing</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create Listing</DialogTitle>
                <DialogDescription>
                <MyForm/>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

        </SignedIn>
      </main>
    );
  }
  