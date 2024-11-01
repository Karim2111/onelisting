"use client";

import * as React from "react";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Listing } from "../client";

import { Dialog, DialogContent } from "~/components/ui/dialog";
import DeleteDialog from "~/components/modals/delete-modal";
import EditDialog from "~/components/modals/edit-modal";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const task = row.original as Listing;

  // Function to close the dialog
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleEditClick}>
            <Pencil className='mr-2 h-4 w-4' />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className='text-red-600'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isDialogOpen && (
        <DialogContent>
          <EditDialog task={task} onClose={handleClose} />
        </DialogContent>
      )}

      <DeleteDialog
        task={task}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      />
    </Dialog>
  );
}