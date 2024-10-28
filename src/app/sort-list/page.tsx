'use client';
import { closestCorners, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import React, { useState } from "react";
import "./App.css";
import { ImgRow } from "../../components/imgUpload/imgRow/imgRow";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// Define the type for a task using UniqueIdentifier
interface TaskType {
    id: UniqueIdentifier;
    src: string;
}

export default function SortListPage() {
    const [tasks, setTasks] = useState<TaskType[]>([
        { id: 1, src: "https://placehold.co/40x60?text=1" },
        { id: 2, src: "https://placehold.co/40x60?text=2" },
        { id: 3, src: "https://placehold.co/40x60?text=3" },
        { id: 4, src: "https://placehold.co/40x60?text=4" },
        { id: 5, src: "https://placehold.co/40x60?text=5" },
        { id: 6, src: "https://placehold.co/40x60?text=6" },
    ]);

    const getTaskPos = (id: UniqueIdentifier): number => {
        return tasks.findIndex((task: TaskType) => task.id === id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setTasks((tasks) => {
            const originalPos = getTaskPos(active.id);
            const newPos = getTaskPos(over.id);

            return arrayMove(tasks, originalPos, newPos);
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className="App">
            <h1>My Images!</h1>
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <ImgRow tasks={tasks} />
            </DndContext>
        </div>
    );
}