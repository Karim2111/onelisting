"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { TaskType } from "~/lib/validations/schema";
import { label_options, priority_options, status_options } from "~/components/ui/filters";

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
      accessorKey: "condition",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Condition' />
      ),
      
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Category' />
        ),
        
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Description' />
        ),
        
    },
    {
        accessorKey: "tags",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Tags' />
        ),
        
    },
    
  ];
