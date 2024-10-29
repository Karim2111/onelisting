import { SignedIn, SignedOut } from "@clerk/nextjs";
import MyForm from "~/components/ui/listing-form";
export const dynamic = "force-dynamic";

export default async function CreateListing() {
  // Fetch listings data on the server side


  return (
    <div className="flex justify-center">
      <MyForm  />
    </div>
  );
}