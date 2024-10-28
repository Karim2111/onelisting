import React from "react";
import "./Task.css";

export const Task = ({id, src}) => {
    return (
    <div className="task">
        <img src={src}></img>
    </div>)
}