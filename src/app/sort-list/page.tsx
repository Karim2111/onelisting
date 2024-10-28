'use client'
import { closestCorners, DndContext } from "@dnd-kit/core"
import React, { useState } from "react";
import "./App.css"
import { ImgRow } from "../../components/imgUpload/imgRow/imgRow";
export default function sortListPage() {
    const [tasks, setTasks] = useState([
        {id: 1, src: "https://placehold.co/40x60?text=1"},
        {id: 2, src: "https://placehold.co/40x60?text=2"},
        {id: 3, src: "https://placehold.co/40x60?text=3"},
        
    ]);
    return (
        <div className="App">
            <h1>My Images!</h1>
            <DndContext collisionDetection={closestCorners}>
                <ImgRow tasks={tasks} />
            </DndContext>
        </div>
    )
}