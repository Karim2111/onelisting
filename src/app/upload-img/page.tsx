'use client';
import { closestCorners, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import React, { useState } from "react";
import "./Upload-UI.css";
import { ImgRow } from "../../components/imgUpload/imgRow/imgRow";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { EmblaOptionsType } from 'embla-carousel';
import 'src/components/imgUpload/EmblaCarousel/css/embla.css';
import EmblaCarousel from "~/components/imgUpload/EmblaCarousel/EmblaCarousel";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";

// Embla Carousel setup
const OPTIONS: EmblaOptionsType = {};

// Define the type for a img using UniqueIdentifier
interface ImgType {
    id: UniqueIdentifier;
    src: string;
}

export type { ImgType };

export default function UploadUI() {
    const [imgs, setImgs] = useState<ImgType[]>([]);
    const [newImgUrl, setNewImgUrl] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [file, setFile] = useState<File | undefined>(undefined)
    const [fileUrl, setPreviewUrl] = useState<string | undefined>(undefined)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setFile(file)
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl)
        }
        if (file) {
            const url = URL.createObjectURL(file)
            addImg(url);

        } else {
            console.log("5")
            setPreviewUrl(undefined)
        }
    } 

    const addImg = (url: string) => {
        setImgs((imgs) => [
            ...imgs,
            {
                id: imgs.length + 1,
                src: url,
            },
        ]);
    }

    const removeCurrentImg = () => {
        setImgs((imgs) => imgs.filter((_, index) => index !== currentIndex));
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    };

    const getImgPos = (id: UniqueIdentifier): number => {
        return imgs.findIndex((img: ImgType) => img.id === id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setImgs((imgs) => {
            const originalPos = getImgPos(active.id);
            const newPos = getImgPos(over.id);

            return arrayMove(imgs, originalPos, newPos);
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 0,
            }
        }),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
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
                                onClick={(e) => {e.preventDefault(); // Prevents form validation messages
                                    document.getElementById('file-upload')?.click()}
                                }
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
                                onChange={(e) => {handleFileChange(e)}}
                            />
                            <p className="text-sm text-gray-500">Max 24 images</p>
                        </div>{imgs.length > 0 && (
                    <>
                    <div className="flex gap-2 justify-end min-w-[28rem]">
                        <Button onClick={removeCurrentImg} variant="secondary">
                            Delete Current Image
                        </Button>
                        <Button onClick={() => setImgs([])} variant="destructive">
                            Delete All Images
                        </Button>
                    </div></>)}</div>
                
            <EmblaCarousel slides={imgs} options={OPTIONS} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />

            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <ImgRow imgs={imgs} />
                

                {/* ImgRow Component */}
                
            </DndContext>
        </div>
    );
}