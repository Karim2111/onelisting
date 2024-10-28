import React from "react";
import "./imgRow.css";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Task } from "../Task/Task";
export const ImgRow = ({tasks}) => {
    return (
        <div className="imgRow">
        <SortableContext items={tasks} strategy={horizontalListSortingStrategy}>
        {tasks.map(task => (
            <Task id={task.id} src={task.src} key={task.id} />
        ))}
        </SortableContext>
    </div>)
}