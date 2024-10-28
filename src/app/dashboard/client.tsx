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
import { Button } from "~/components/ui/button";
import * as z from "zod"


interface Listing {
    id: number;
    userId: string | null;
    title: string;
    images: unknown;
    price: number;
    sku: string | null;
    condition: string;
    category: string;
    description: string;
    tags: unknown;
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface ClientDashboardProps {
    listings: Listing[];
  }

const ClientDashboard: React.FC<ClientDashboardProps> = ({ listings }) => {
  const [open, setOpen] = useState(false);
  const [localListings, setLocalListings] = useState(listings);

  const handleNewListing = (newListing: Listing) => {
    setLocalListings((prev) => [newListing, ...prev]); // Add new listing to the top
  };

  return (
    <div>
      <div className="flex justify-center p-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Create Listing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Listing</DialogTitle>
              <DialogDescription>
                <MyForm setOpen={setOpen} onNewListing={handleNewListing} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Render listings */}
      <div className="flex justify-center flex-col gap-4 p-4">
        {listings.map((listing) => (
          <div key={listing.id} className="flex flex-row gap-2">
            <div className="text-xl font-semibold">{listing.title}</div>
            <div className="text-lg">${listing.price}</div>
            <div className="text-lg">{listing.sku}</div>
            <div className="text-lg">{listing.condition}</div>
            <div className="text-lg">{listing.category}</div>
            <div className="text-lg">{listing.description}</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;