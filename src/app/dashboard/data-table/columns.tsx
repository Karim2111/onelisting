"use client";

import { ColumnDef } from "@tanstack/react-table";

interface Listing {
    id: number;
    userId: string | null;
    title: string;
    images: string[];
    price: number;
    sku: string | null;
    condition: string;
    category: string;
    description: string;
    tags: string[] | null;
    createdAt: Date;
    updatedAt: Date;
}

export const columns: ColumnDef<Listing>[] = [
    { accessorKey: "id", header: () => "ID" },
    { accessorKey: "title", header: () => "Title" },
    { accessorKey: "images", header: () => "Images" },
    { accessorKey: "price", header: () => "Price" },
    { accessorKey: "sku", header: () => "SKU" },
    { accessorKey: "condition", header: () => "Condition" },
    { accessorKey: "category", header: () => "Category" },
    { accessorKey: "description", header: () => "Description" },
    { accessorKey: "tags", header: () => "Tags" },
    { accessorKey: "createdAt", header: () => "Created At" },
    { accessorKey: "updatedAt", header: () => "Updated At" },
];
