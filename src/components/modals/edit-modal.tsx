import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Listing } from "~/app/dashboard/client";
import { updateListing } from "~/app/dashboard/actions";
import { useToast } from "src/hooks/use-toast"; // From shadcn/ui
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditProps = {
  task: Listing;
  onClose: () => void;  // Close function passed as a prop
};

export const editSchema = z.object({
  id: z.number(),
  title: z.string().min(8).max(64),
  price: z.number().int().nonnegative().lte(999999999),
  sku: z.string().min(1).max(64).optional(),
  category: z.string(),
});

type editSchemaType = z.infer<typeof editSchema>;

export default function EditDialog({ task, onClose }: EditProps) {
  const form = useForm<editSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      id: task.id,
      title: task.title,
      price: task.price,
      sku: task.sku ?? undefined,
      category: task.category,
    },
  });

  const { toast } = useToast(); // shadcn/ui toast
  async function handleUpdate(values: editSchemaType) {
    try {
      await updateListing(values); // Pass `task.id` to update the specific listing
      toast({
        title: "Success!",
        description: "Listing Updated successfully.",
        duration: 5000,
        style: {
          backgroundColor: "limegreen", // Bright green background
          color: "white", // White text for contrast
        },
      });
      onClose();  // Close the dialog after updating
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        title: "Error",
        description: "Failed to edit the listing.",
        duration: 3000,
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Listing Details</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)} className="grid gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2 w-full">
              Update Listing
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}