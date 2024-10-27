"use client"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"


// UI 
import {  Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { CloudUpload, Paperclip } from "lucide-react";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "~/components/ui/file-upload";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { TagsInput } from "~/components/ui/tags-input";
import { insertListingToDb } from "~/app/dashboard/actions"
import { UploadButton } from "~/app/utils/uploadthing"

export const formSchema = z.object({
  title: z.string().min(8).max(64),
  price: z.number().int().nonnegative().lte(999999999),
  sku: z.string().min(1).max(64).optional(),
  condition: z.string(),
  category: z.string(),
  description: z
    .string()
    .min(1, {
      message: "Description must be at least 1 character.",
    })
    .max(61000, {
      message: "Description must not be longer than 61000 characters.",
    }),
  tags: z.array(z.string()).nonempty()
});

interface MyFormProps {
  setOpen: (value: boolean) => void; // Type for setOpen function
}

export default function MyForm({ setOpen }: MyFormProps ) {

  const [files, setFiles] = useState < File[] | null > (null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "tags": [""]
    },
  })

  async function onSubmit(values: z.infer < typeof formSchema > ) {
    
    try {
      console.log(values);
      await insertListingToDb(values);
      setOpen(false); // Close the dialog
      toast.success("Listing created Successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
       
      <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <UploadButton endpoint="imageUploader"/>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />



        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                placeholder="Title"
                
                type="text"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-12 gap-4">
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                placeholder="Price"
                
                type="number"
                {...field} 
                onChange={event => field.onChange(+event.target.value)}/>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                placeholder="SKU"
                
                type="text"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
        </div>
        
        <div className="grid grid-cols-12 gap-4">
          
          <div className="col-span-6">
            
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
          </div>
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">new</SelectItem>
                  <SelectItem value="like-new">Used (like-new)</SelectItem>
                  <SelectItem value="good">Used (good)</SelectItem>
                  <SelectItem value="fair">Used (fair)</SelectItem>
                </SelectContent>
              </Select>
                
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Tags"
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}