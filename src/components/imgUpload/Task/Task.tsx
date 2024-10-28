import React from "react";
import "./Task.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Button } from "~/components/ui/button";


interface TaskProps {
    id: UniqueIdentifier;
    src: string;
  }

export const Task: React.FC<TaskProps> = ({ id, src }) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    return (
    <div 
    ref = {setNodeRef} 
    {...attributes} 
    {...listeners} 
    style={style}
    className="task">
       <img src={src}></img>
    </div>)
}