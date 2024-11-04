"use client"

import type { Table } from "@tanstack/react-table"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { PlusCircle, X } from "lucide-react"
import Link from "next/link"


interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter tasks..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-9 w-[150px] lg:w-[250px]"
          />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/create-listing" className="inline-flex items-center justify-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Listing
          </Link>
        </Button>
      </div>
        
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}