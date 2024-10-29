"use client";
import { closestCorners, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import React, { useState } from "react";
import "./Upload-UI.css";
import { ImgRow } from "../../components/imgUpload/imgRow/imgRow";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { EmblaOptionsType } from "embla-carousel";
import 'src/components/imgUpload/EmblaCarousel/css/embla.css';
import EmblaCarousel from "~/components/imgUpload/EmblaCarousel/EmblaCarousel";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

// Embla Carousel setup
const OPTIONS: EmblaOptionsType = { loop: false };

// Define the type for an image using UniqueIdentifier
export interface ImgType {
  id: UniqueIdentifier;
  src: string;
}

export default function UploadUI() {
  const [imgs, setImgs] = useState<ImgType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []); // Convert FileList to an array
    const newImgs: ImgType[] = [];

    files.forEach((file) => {
      const newUrl = URL.createObjectURL(file);

      // Check if the image already exists in the state
      const isDuplicate = imgs.some((img) => img.src === newUrl);
      if (!isDuplicate) {
        newImgs.push({ id: uuidv4(), src: newUrl });
      } else {
        // Revoke the URL if it's a duplicate
        URL.revokeObjectURL(newUrl);
      }
    });

    // Add the new images to the state
    setImgs((prevImgs) => [...prevImgs, ...newImgs]);

    // Clear the file input to allow re-uploading the same files
    e.target.value = "";
  };

  const removeCurrentImg = () => {
    // Revoke the URL of the image to free up memory
    const imgToRemove = imgs[currentIndex];
    if (imgToRemove) URL.revokeObjectURL(imgToRemove.src);

    setImgs((imgs) => imgs.filter((_, index) => index !== currentIndex));
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setImgs((imgs) => {
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
      {/* Embla Carousel Component */}
      <div className="flex flex-row">
        <div className="flex flex-col items-center space-y-2 justify-left">
          <Button
            variant="outline"
            size="lg"
            className="w-full max-w-xs"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('file-upload')?.click();
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple // Allow multiple file selection
            accept="image/*"
            className="hidden"
            aria-label="Upload images"
            onChange={handleFileChange}
          />
          <p className="text-sm text-gray-500">Max 24 images</p>
        </div>
        {imgs.length > 0 && (
          <div  className="flex gap-2 justify-end min-w-[28rem]">
            <Button type="button" onClick={removeCurrentImg} variant="secondary">
              Delete Current Image
            </Button>
            <Button type="button" onClick={() => {
              imgs.forEach((img) => URL.revokeObjectURL(img.src)); // Revoke URLs before clearing
              setImgs([]);
            }} variant="destructive">
              Delete All Images
            </Button>
          </div>
        )}
      </div>

      <EmblaCarousel slides={imgs} options={OPTIONS} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <ImgRow imgs={imgs} />
      </DndContext>
    </div>
  );
}
