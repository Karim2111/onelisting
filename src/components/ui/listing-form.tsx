"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"


// UI 
import {  Button } from "~/components/ui/button"
import { useToast } from "src/hooks/use-toast"; // From shadcn/ui
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { TagsInput } from "~/components/ui/tags-input";
import { insertListingToDb } from "~/app/dashboard/actions"
import { useRouter } from "next/navigation"
import UploadUI from "~/app/upload-img/page"

export const formSchema = z.object({
  photos: z.array(z.string().url()),
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
  tags: z.array(z.string())
});


export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: [] , photos: ["https://placehold.co/300x400/blue/white"]},
  });

  const { toast } = useToast(); // shadcn/ui toast
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await insertListingToDb(values); // Get the new listing from the database

      toast({
        title: "Success!",
        description: "Listing created successfully.",
        duration: 5000,
        style: {
          backgroundColor: "limegreen", // Bright green background
          color: "white", // White text for contrast
        },
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        title: "Error",
        description: "Failed to create the listing.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="w-[42rem] overflow-auto max-h-[100%] ">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
       
      <FormField
          control={form.control}
          name="photos"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                
                <UploadUI />
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
    </div>
  )
}