import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { Shell } from "../../components/shells/shell";
import { getmyListings } from "~/server/db/listings/queries";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Plus, Link as LinkIcon } from "lucide-react";

export const runtime = 'edge';

export default async function TaskPage() {
  const listings = await getmyListings();
  return (
    <Shell variant={"centered"}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-primary">My OneListing Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create-listing">
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/connections">
              <LinkIcon className="h-4 w-4 mr-2" />
              Connections
            </Link>
          </Button>
        </div>
      </div>
      <div className="hidden md:block">
        <DataTable data={listings} columns={columns} />
      </div>
      <div className="md:hidden">
        <h1 className="text-2xl font-bold text-primary">New table</h1>
      </div>
    </Shell>
  );
}
