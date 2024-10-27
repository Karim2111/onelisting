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


export default  function DashboardPage() {
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
        </SignedIn>
      </main>
    );
  }
  