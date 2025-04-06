"use client";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useState } from "react";
import "./Upload-UI.css";
import { ImgRow } from "../imgUpload/imgRow/imgRow";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { EmblaOptionsType } from "embla-carousel";
import "src/components/imgUpload/EmblaCarousel/css/embla.css";
import EmblaCarousel from "~/components/imgUpload/EmblaCarousel/EmblaCarousel";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "~/app/api/uploadthing/core";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const OPTIONS: EmblaOptionsType = { 
  loop: false,
  align: "center",
  containScroll: "trimSnaps",
  dragFree: false
};

export interface ImgType {
  id: UniqueIdentifier;
  src: string;
  file: File;
  uploadedUrl: string | null;
  uploadedKey: string | null;
}

type UploadUIProps = {
  onUploaded?: (urls: string[]) => void;
};

export default function UploadUI({ onUploaded }: UploadUIProps) {
  const [imgs, setImgs] = useState<ImgType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [pendingUploads, setPendingUploads] = useState<Set<UniqueIdentifier>>(new Set());
  const pendingDeletions = React.useRef<Map<UniqueIdentifier, string | null>>(new Map());
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (uploadedFiles) => {
      if (!uploadedFiles) {
        console.error("Upload failed: No files returned");
        return;
      }

      // Process completed uploads
      setImgs((prevImgs) => {
        let index = 0;
        const updatedImgs = prevImgs.map((img) => {
          if (img.uploadedUrl === null && index < uploadedFiles.length) {
            const uploadedFile = uploadedFiles[index];
            index++;
            if (uploadedFile) {
              // Skip this image if it has been marked for deletion during upload
              if (pendingDeletions.current.has(img.id)) {
                console.log(`Deleting image with id ${img.id} after upload completed`);
                // Delete the file as it has completed uploading
                if (uploadedFile.key) {
                  void deleteUploadedFiles([uploadedFile.key]);
                }
                pendingDeletions.current.delete(img.id);
                return null;
              }
              
              // Remove from pending uploads
              setPendingUploads(prev => {
                const newSet = new Set(prev);
                newSet.delete(img.id);
                return newSet;
              });
              
              return {
                ...img,
                uploadedUrl: uploadedFile.url,
                uploadedKey: uploadedFile.key,
              };
            }
          }
          return img;
        }).filter((img): img is ImgType => img !== null);

        const uploadedUrls = updatedImgs
          .map((img) => img.uploadedUrl)
          .filter((url): url is string => url !== null);

        // Use setTimeout to defer the callback until after render
        if (onUploaded && uploadedUrls.length >= 0) {
          setTimeout(() => {
            onUploaded(uploadedUrls);
          }, 0);
        }

        return updatedImgs;
      });
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      // Clear pending uploads on error
      setPendingUploads(new Set());
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newImgs: ImgType[] = [];
    const newPendingIds: UniqueIdentifier[] = [];

    files.forEach((file) => {
      const newUrl = URL.createObjectURL(file);
      const isDuplicate = imgs.some((img) => img.src === newUrl);

      if (!isDuplicate) {
        const id = uuidv4();
        newImgs.push({
          id,
          src: newUrl,
          file: file,
          uploadedUrl: null,
          uploadedKey: null,
        });
        newPendingIds.push(id);
      } else {
        URL.revokeObjectURL(newUrl);
      }
    });

    // Add new images to pending uploads tracker
    setPendingUploads(prev => {
      const newSet = new Set(prev);
      newPendingIds.forEach(id => newSet.add(id));
      return newSet;
    });
    
    setImgs((prevImgs) => [...prevImgs, ...newImgs]);

    // Start the upload
    await startUpload(newImgs.map((img) => img.file));

    e.target.value = "";
  };

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

  const deleteAllImages = async () => {
    // Store references to files that need cleanup
    const imagesToCleanup = [...imgs];
    
    // Update UI immediately
    setImgs([]);
    
    // Update the form state with empty array immediately - use setTimeout
    if (onUploaded) {
      setTimeout(() => {
        onUploaded([]);
      }, 0);
    }
    
    // Then handle cleanup operations asynchronously
    imagesToCleanup.forEach((img) => {
      URL.revokeObjectURL(img.src);
      
      // Mark every image for deletion regardless of state
      if (pendingUploads.has(img.id)) {
        console.log(`Marking image with id ${img.id} for deletion after upload`);
        pendingDeletions.current.set(img.id, null);
      } else if (img.uploadedKey) {
        console.log(`Queuing deletion for image with key ${img.uploadedKey}`);
        pendingDeletions.current.set(img.id, img.uploadedKey);
      }
    });
    
    // Delete any files that are already uploaded
    const uploadedKeys = imagesToCleanup
      .filter(img => !pendingUploads.has(img.id) && img.uploadedKey !== null)
      .map(img => img.uploadedKey)
      .filter((key): key is string => key !== null);
    
    if (uploadedKeys.length > 0) {
      console.log(`Deleting ${uploadedKeys.length} already uploaded images`);
      await deleteUploadedFiles(uploadedKeys);
    }
  };

  const removeCurrentImg = async () => {
    const imgToRemove = imgs[currentIndex];
    if (!imgToRemove) return;
    
    // Update UI immediately - remove the image from state first
    setImgs((currentImgs) => {
      const newImgs = currentImgs.filter((_, index) => index !== currentIndex);
      
      // Update the form state with the remaining uploaded URLs - use setTimeout
      const remainingUrls = newImgs
        .map((img) => img.uploadedUrl)
        .filter((url): url is string => url !== null);
      
      if (onUploaded) {
        setTimeout(() => {
          onUploaded(remainingUrls);
        }, 0);
      }
      
      return newImgs;
    });
    
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    
    // Mark this image for deletion regardless of its upload state
    URL.revokeObjectURL(imgToRemove.src);
    
    // If the image is still uploading, mark it for deletion after upload completes
    if (pendingUploads.has(imgToRemove.id)) {
      console.log(`Marking image with id ${imgToRemove.id} for deletion after upload`);
      pendingDeletions.current.set(imgToRemove.id, null);
    } else if (imgToRemove.uploadedKey) {
      // If upload is complete, delete it now
      console.log(`Deleting uploaded image with key ${imgToRemove.uploadedKey}`);
      await deleteUploadedFiles([imgToRemove.uploadedKey]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setImgs((imgs: ImgType[]) => {
      const originalPos = imgs.findIndex((img) => img.id === active.id);
      const newPos = imgs.findIndex((img) => img.id === over.id);

      return arrayMove(imgs, originalPos, newPos);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div className="Upload-UI">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col items-center gap-3 w-full">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("file-upload")?.click();
            }}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {isUploading 
              ? "Please wait while your images upload..." 
              : `${imgs.length}/24 images added`}
          </p>
          
          {imgs.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={removeCurrentImg}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Delete Current Image
              </Button>
              <Button
                type="button"
                onClick={deleteAllImages}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Delete All Images
              </Button>
            </div>
          )}
        </div>

        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          aria-label="Upload images"
          onChange={handleFileChange}
        />
      </div>

      <EmblaCarousel
        slides={imgs}
        options={OPTIONS}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <ImgRow imgs={imgs} />
      </DndContext>
    </div>
  );
}
