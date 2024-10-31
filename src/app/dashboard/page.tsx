import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { Shell } from "../../components/shells/shell";
import { taskSchema } from "~/lib/validations/schema";
import { z } from "zod";
import { getmyListings } from "~/server/queries";

export const runtime = 'edge';





export default async function TaskPage() {
  const listings = await getmyListings();
  return (
    <Shell>
      <div className='flex h-full min-h-screen w-full flex-col'>
        <DataTable data={listings} columns={columns} />
      </div>
    </Shell>
  );
}