import React from "react";
import "./Task.css";

interface TaskProps {
    id: number;
    src: string;
  }

export const Task: React.FC<TaskProps> = ({ id, src }) => {
    return (
    <div className="task">
        <img src={src}></img>
    </div>)
}