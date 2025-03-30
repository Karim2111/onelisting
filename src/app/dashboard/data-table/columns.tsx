"use client";

import type{ ColumnDef } from "@tanstack/react-table";


import { Checkbox } from "~/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import Image from "next/image";


 interface Listing {
    id: number;
    userId: string | null;
    title: string;
    images: string[];
    price: number;
    sku: string | null;
    condition: string;
    category: string;
    description: string;
    tags: string[] | null;
    createdAt: Date;
    updatedAt: Date;
}

export const columns: ColumnDef<Listing>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "images",
      cell: ({ row }) => {
        const images = row.getValue<string[]>("images");
        const firstImage = images && images.length > 0 ? images[0] : null;
        return firstImage ? (
          <Image
            src={firstImage}
            alt="Listing Image"
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
          />
        ) : null;
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" className="hidden lg:block" />
      ),
      cell: ({ row }) => <p className="hidden lg:block">${row.getValue("price")}</p>,
    },
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SKU" className="hidden lg:block" />
      ),
      cell: ({ row }) => <p className="hidden lg:block">{row.getValue("sku")}</p>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" className="hidden lg:block" />
      ),
      cell: ({ row }) => <p className="hidden lg:block">{row.getValue("category")}</p>,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Updated" className="hidden lg:block" />
      ),
      cell: ({ row }) => {
        const updatedAt = new Date(row.getValue("updatedAt"));
        const dateStr = updatedAt.toString();
        const longFormat = /([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})/;
        const match = longFormat.exec(dateStr);
        const formattedDate = match ? `${match[1]} ${match[2]}, ${match[3]}` : dateStr;
        return <div className="hidden lg:block">{formattedDate}</div>;
      },
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions"  />
      ),
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row}  />,
    },
  ];
  
  

