"use client";

import React, { useState } from "react";
import MyForm, { formSchema } from "~/components/ui/listing-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import * as z from "zod"
import Link from "next/link";
import { Plus } from "lucide-react";


interface Listing {
    id: number;
    userId: string | null;
    title: string;
    images:string[];
    price: number;
    sku: string | null;
    condition: string;
    category: string;
    description: string;
    tags: string[] | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface ClientDashboardProps {
    listings: Listing[];
  }

  export type {Listing as myListingType}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ listings }) => {
  const [open, setOpen] = useState(false);
  const [localListings, setLocalListings] = useState(listings);

  const handleNewListing = (newListing: Listing) => {
    setLocalListings((prev) => [newListing, ...prev]); // Add new listing to the top
  };

  return (
    <div >
      <Button asChild>
      <Button asChild>
        <Link href="/create-listing">
          <Plus />Create Listing
        </Link>
      </Button>

      </Button>

      {/* Render listings */}
      <div className="flex justify-center flex-col gap-4 p-4">
        {listings.map((listing) => (
          <div key={listing.id} className="flex flex-row gap-2">
            <div className="text-xl font-semibold">{listing.title}</div>
            {listing.images.map((image) => (
              <img src={image} className="h-4 w-4"  />
            ))}
            <div className="text-lg">${listing.price}</div>
            <div className="text-lg">{listing.sku}</div>
            <div className="text-lg">{listing.condition}</div>
            <div className="text-lg">{listing.category}</div>
            <div className="text-lg">{listing.description}</div>
            <div className="text-lg">{listing.tags}</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;