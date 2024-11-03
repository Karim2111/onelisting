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
import { FloatingInput, FloatingTextarea } from "../ui/inputsLight";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/selectThick";

type EditProps = {
  task: Listing;
  onClose: () => void;  // Close function passed as a prop
};

export const editSchema = z.object({
  id: z.number(),
  title: z.string().min(8).max(64),
  price: z.number().int().nonnegative().gte(0).lte(999999999),
  sku: z.string().min(1).max(64).optional(),
  condition: z.string(),
  description: z
    .string()
    .min(8, {
      message: "Description must be at least 8 character.",
    })
    .max(61000, {
      message: "Description must not be longer than 61000 characters.",
    }),
  
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
      condition: task.condition,
      description: task.description,
    },
  });

  const { toast } = useToast(); // shadcn/ui toast
  async function handleUpdate(values: editSchemaType) {

    try {
      await updateListing(values); // Pass `task.id` to update the specific listing
      toast({
        title: "Success!",
        description: "Listing Updated successfully.",
        duration: 3000
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
              <FormControl>
                <FloatingInput 
                placeholder="Price ($)"
                type="number"
                {...field} 
                onChange={event => field.onChange(+event.target.value)}/>
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
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="new">Brand new</SelectItem>
                      <SelectItem value="like-new">Used (like-new)</SelectItem>
                      <SelectItem value="good">Used (good)</SelectItem>
                      <SelectItem value="fair">Used (fair)</SelectItem>
                    </SelectContent>
                  </Select>
                    
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingTextarea
                  placeholder="Description"
                  className="h-32"
                  minLength={8}
                  maxLength={64}
                  {...field}
                />
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