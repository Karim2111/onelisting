"use client";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useState } from "react";
import "./Upload-UI.css";
import { ImgRow } from "../imgUpload/imgRow/imgRow";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { EmblaOptionsType } from "embla-carousel";
import "src/components/imgUpload/EmblaCarousel/css/embla.css";
import EmblaCarousel from "~/components/imgUpload/EmblaCarousel/EmblaCarousel";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "~/app/api/uploadthing/core";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const OPTIONS: EmblaOptionsType = { loop: false };

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

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (uploadedFiles) => {
      if (!uploadedFiles) {
        console.error("Upload failed: No files returned");
        return;
      }

      setImgs((prevImgs) => {
        let index = 0;
        const updatedImgs = prevImgs.map((img) => {
          if (img.uploadedUrl === null && index < uploadedFiles.length) {
            const uploadedFile = uploadedFiles[index];
            index++;
            if (uploadedFile) {
              return {
                ...img,
                uploadedUrl: uploadedFile.url,
                uploadedKey: uploadedFile.key,
              };
            }
          }
          return img;
        });

        const uploadedUrls = updatedImgs
          .map((img) => img.uploadedUrl)
          .filter((url): url is string => url !== null);

        if (onUploaded) {
          onUploaded(uploadedUrls);
        }

        return updatedImgs;
      });
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newImgs: ImgType[] = [];

    files.forEach((file) => {
      const newUrl = URL.createObjectURL(file);
      const isDuplicate = imgs.some((img) => img.src === newUrl);

      if (!isDuplicate) {
        newImgs.push({
          id: uuidv4(),
          src: newUrl,
          file: file,
          uploadedUrl: null,
          uploadedKey: null,
        });
      } else {
        URL.revokeObjectURL(newUrl);
      }
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

      const data: { success?: boolean; error?: string } = await response.json();
      if (!response.ok) {
        console.error('Error deleting files:', data.error);
      }
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

  const removeCurrentImg = async () => {
    const imgToRemove = imgs[currentIndex];
    if (imgToRemove) {
      URL.revokeObjectURL(imgToRemove.src);
      if (imgToRemove.uploadedKey) {
        await deleteUploadedFiles([imgToRemove.uploadedKey]);
      }
    }

    setImgs((imgs) => imgs.filter((_, index) => index !== currentIndex));
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
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
      <div className="flex flex-row">
        <div className="flex flex-col items-center space-y-2 justify-left">
          <Button
            variant="outline"
            size="lg"
            className="w-full max-w-xs"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("file-upload")?.click();
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            aria-label="Upload images"
            onChange={handleFileChange}
          />
          <p className="text-sm text-gray-500">Max 24 images</p>
        </div>
        {imgs.length > 0 && (
          <div className="flex gap-2 justify-end min-w-[28rem]">
            <Button
              type="button"
              onClick={removeCurrentImg}
              variant="secondary"
            >
              Delete Current Image
            </Button>
            <Button
              type="button"
              onClick={async () => {
                imgs.forEach((img) => URL.revokeObjectURL(img.src));
                const uploadedKeys = imgs
                  .map((img) => img.uploadedKey)
                  .filter((key): key is string => key !== null);
                if (uploadedKeys.length > 0) {
                  await deleteUploadedFiles(uploadedKeys);
                }
                setImgs([]);
              }}
              variant="destructive"
            >
              Delete All Images
            </Button>
          </div>
        )}
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
