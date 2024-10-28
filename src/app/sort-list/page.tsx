'use client';
import { closestCorners, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import React, { useState } from "react";
import "./App.css";
import { ImgRow } from "../../components/imgUpload/imgRow/imgRow";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// Define the type for a img using UniqueIdentifier
interface ImgType {
    id: UniqueIdentifier;
    src: string;
}

export default function SortListPage() {
    const [imgs, setImgs] = useState<ImgType[]>([
        { id: 1, src: "https://placehold.co/80x70?text=1" },
    ]);

    const [newImgUrl, setNewImgUrl] = useState<string>('');

    const addImg = (url: string) => {
        setImgs((imgs) => [
            ...imgs,
            {
                id: imgs.length + 1,
                src: url,
            },
        ]);
    }

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
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (newImgUrl.trim()) {
            addImg(newImgUrl);
            setNewImgUrl('');
        }
    };

    return (
        <div className="App">
            <h1>My Images!</h1>
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={newImgUrl} 
                        onChange={(e) => setNewImgUrl(e.target.value)} 
                        placeholder="Enter image URL" 
                    />
                    <button type="submit">Add Img</button>
                </form>
                <ImgRow imgs={imgs} />
            </DndContext>
        </div>
    );
}