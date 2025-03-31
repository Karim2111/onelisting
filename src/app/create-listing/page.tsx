import MyForm from "~/components/ui/listing-form";
export const dynamic = "force-dynamic";

export default async function CreateListing() {
  return (
    <div className="flex justify-center max-width-[90%]">
      <MyForm  />
    </div>
  );
}