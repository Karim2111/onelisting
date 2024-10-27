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

interface ClientDashboardProps {
  listings: any ;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ listings }) => {
  const [open, setOpen] = useState(false);

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
                <MyForm setOpen={setOpen} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Render listings */}
      <div className="flex justify-center flex-col gap-4 p-4">
        {listings.map(
            (values: { id: React.Key;
                      title: string;
                      price: string;
                      sku: string;
                      condition: string;
                      category: string;
                      description: string;
                    }) => (
          <div key={values.id} className="flex flex-row gap-2">
            <div className="text-xl font-semibold">{values.title}</div>
            <div className="text-lg">${values.price}</div>
            <div className="text-lg">{values.sku}</div>
            <div className="text-lg">{values.condition}</div>
            <div className="text-lg">{values.category}</div>
            <div className="text-lg">{values.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;