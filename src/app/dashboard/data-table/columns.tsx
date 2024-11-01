"use client";

import type{ ColumnDef } from "@tanstack/react-table";


import { Checkbox } from "~/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { string } from "zod";



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
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Task' />
      ),
      cell: ({ row }) => <div className='w-[80px]'>{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
    },
    {
      accessorKey: "images",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Images' />
      ),
      cell: ({ row }) => {
        const images = row.getValue<string[]>("images");
        const firstImage = images && images.length > 0 ? images[0] : null;
        return firstImage ? (
          <img src={firstImage} alt="Listing Image" style={{ width: 50, height: 50 }} />
        ) : null;
      },
    },
    
    
    
    
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Price' />
      ),
      
    },
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='SKU' />
      ),
      
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Category' />
        ),
        
    },
    {
      accessorKey: "dateLastUpdated",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Date Last updated' />
      ),
      
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },

  
  ];
