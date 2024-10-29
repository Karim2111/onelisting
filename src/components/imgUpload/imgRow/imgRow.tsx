import React from "react";
import "./imgRow.css";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Img } from "../Img/Img";

// Define the type for a single img
interface ImgType {
    id: UniqueIdentifier;
    src: string;
  }
  
  // Define the type for the props of ImgRow
  interface ImgRowProps {
    imgs: ImgType[];
  }

export const ImgRow: React.FC<ImgRowProps> = ({ imgs }) => {
    if (imgs.length === 0) return null;
    return (
      <>
        <div className="imgRow">
        <SortableContext items={imgs} strategy={horizontalListSortingStrategy}>
        {imgs.map(img => (
            <Img id={img.id} src={img.src} key={img.id} />
        ))}
        </SortableContext>
    </div>
    <p className="text-sm text-gray-500">Drag to rearrange</p></>)
}