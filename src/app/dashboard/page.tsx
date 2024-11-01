import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { Shell } from "../../components/shells/shell";


import { getmyListings } from "~/server/queries";


export const runtime = 'edge';





export default async function TaskPage() {
  const listings = await getmyListings();
  return (
    <Shell>
      <h1 className="text-4xl font-bold text-primary mb-2">My OneListing Dashboard</h1>
      <div className='flex h-full min-h-screen w-full flex-col max-w-[100%]'>
        <DataTable data={listings} columns={columns} />
      </div>
    </Shell>
  );
}