"use client"
export const dynamic = "force-dynamic";
// * * This is just a demostration of delete modal, actual functionality may vary

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "~/components/ui/alert-dialog";
  import type {Listing} from "~/app/dashboard/client";
  import { Button } from "~/components/ui/button";
import { deleteListing } from "~/server/db/listings/queries";
import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteProps = {
  task: Listing;
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
};

export default function DeleteDialog({
  task,
  isOpen,
  showActionToggle,
}: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const deleteUploadedFiles = async (fileKeys: string[]) => {
    try {
      const response = await fetch('/api/delete-uploadthing-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKeys }),
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok) {
        console.error('Error deleting files:', data.error ?? 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Delete the listing
      const result = await deleteListing(task.id);
      
      if (result.success) {
        // Delete associated images if they exist
        if (task.images && task.images.length > 0) {
          // Extract file keys from image URLs
          const fileKeys = task.images
            .map(url => {
              // Extract the key from the URL
              // This assumes the URL format from uploadthing
              const parts = url.split('/');
              return parts[parts.length - 1];
            })
            .filter((key): key is string => key !== undefined && key !== '');
          
          // Delete the files if we have valid keys
          if (fileKeys.length > 0) {
            await deleteUploadedFiles(fileKeys);
          }
        }
        
        // Close the dialog and refresh the page
        showActionToggle(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete your listing: <br /> <b>{task.title}</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center">
                <svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}