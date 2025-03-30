import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { Shell } from "../../components/shells/shell";
import { getmyListings } from "~/server/db/listings/queries";

export const runtime = 'edge';

export default async function TaskPage() {
  const listings = await getmyListings();
  return (
    
      <Shell variant={"centered"}>
        <h1 className="text-4xl font-bold text-primary">My OneListing Dashboard</h1>
        <div className="hidden md:block">
          <DataTable data={listings} columns={columns} />
        </div>
        <div className="md:hidden">
          <h1 className="text-2xl font-bold text-primary">New table</h1>
        </div>
      </Shell>
    
  );
}
