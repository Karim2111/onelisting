import React from "react";
import "./Img.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UniqueIdentifier } from "@dnd-kit/core";
import Image from "next/image";

interface ImgProps {
    id: UniqueIdentifier;
    src: string;
}

export const Img: React.FC<ImgProps> = ({ id, src }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={style}
            className="img-container"
        >
            <Image 
                className="img" 
                src={src} 
                alt={`Image ${id}`} 
                width={300}
                height={300}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
    );
};