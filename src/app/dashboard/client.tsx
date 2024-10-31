"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

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

interface ClientDashboardProps {
  listings: Listing[];
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ listings }) => {
  const [localListings, setLocalListings] = useState(listings);

  const handleNewListing = (newListing: Listing) => setLocalListings([newListing, ...localListings]);

  return (
    <div>
      <Button asChild>
        <Link href="/create-listing">
          <Plus /> Create Listing
        </Link>
      </Button>
      <DataTable columns={columns} data={localListings} />
    </div>
  );
};

export default ClientDashboard;
