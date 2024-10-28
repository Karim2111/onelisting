import React from "react";
import "./imgRow.css";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Task } from "../Task/Task";
import { UniqueIdentifier } from "@dnd-kit/core";

// Define the type for a single task
interface TaskType {
    id: UniqueIdentifier;
    src: string;
  }
  
  // Define the type for the props of ImgRow
  interface ImgRowProps {
    tasks: TaskType[];
  }

export const ImgRow: React.FC<ImgRowProps> = ({ tasks }) => {
    return (
        <div className="imgRow">
        <SortableContext items={tasks} strategy={horizontalListSortingStrategy}>
        {tasks.map(task => (
            <Task id={task.id} src={task.src} key={task.id} />
        ))}
        </SortableContext>
    </div>)
}