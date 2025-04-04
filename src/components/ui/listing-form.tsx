"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import React from "react"


// UI 
import {  Button } from "~/components/ui/button"
import { useToast } from "src/hooks/use-toast"; // From shadcn/ui
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { insertListingToDb } from "~/server/db/listings/actions";
import { useRouter } from "next/navigation";
import UploadUI from "~/components/UploadUI/UploadUI";
import TagsField from "~/components/ui/tags-component";
import { FloatingInput, FloatingTextarea, FloatingNumberInput } from "./inputsLight"

const descriptionMinLength = 8;
const descriptionMaxLength = 61000;
const titleMinLength = 8;
const titleMaxLength = 64;
const skuMaxLength = 64;
const skuMinLength = 1;
const priceMinValue = 0;
const priceMaxValue = 999999999;

export const formSchema = z.object({
  photos: z.array(z.string().url()),
  title: z.string().min(titleMinLength).max(titleMaxLength),
  price: z.number().int().nonnegative().gte(priceMinValue).lte(priceMaxValue),
  sku: z.string().min(skuMinLength).max(skuMaxLength).optional(),
  condition: z.string(),
  category: z.string(),
  description: z
    .string()
    .min(descriptionMinLength, {
      message: "Description must be at least 8 character.",
    })
    .max(descriptionMaxLength, {
      message: "Description must not be longer than 61000 characters.",
    }),
  tags: z.array(z.string())
});


export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: [], price: 0 },
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const { toast } = useToast();
  const router = useRouter();
  const uploadedUrlsRef = React.useRef<string[]>([]);

  const handleUploaded = React.useCallback((urls: string[]) => {
    uploadedUrlsRef.current = urls;
  }, []);

  React.useEffect(() => {
    if (uploadedUrlsRef.current.length > 0) {
      form.setValue('photos', uploadedUrlsRef.current);
    }
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await insertListingToDb(values); // Get the new listing from the database

      toast({
        title: "Success!",
        description: "Listing created successfully.",
        duration: 3000
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
    <div className="w-full max-w-3xl overflow-auto max-h-[100%] mx-auto p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight text-center mb-8">
        List Your Item
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-card/30 rounded-lg p-6 shadow-sm border border-border/40">
            <h3 className="text-lg font-medium mb-4">Product Images</h3>
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <UploadUI onUploaded={handleUploaded} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="bg-card/30 rounded-lg p-6 shadow-sm space-y-6 border border-border/40">
            <h3 className="text-lg font-medium mb-4">Product Details</h3>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput 
                      placeholder="Title"
                      type="text"
                      {...field}
                      minLength={8}
                      maxLength={64}
                      className="bg-background/60"
                    />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 pt-4 pb-1 bg-background/60 relative focus:border-primary border-outline focus:border-2 focus:outline-none focus:ring-0">
                        <span className="absolute left-3 top-2 text-xs pointer-events-none">Category</span>
                        <SelectValue className="text-left pt-2" placeholder=" " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Used (like-new)</SelectItem>
                      <SelectItem value="good">Used (good)</SelectItem>
                      <SelectItem value="fair">Used (fair)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingNumberInput
                          placeholder="Price ($)"
                          allowDecimals={true}
                          step={0.01}
                          {...field}
                          className="bg-background/60"
                          onChange={(e) => {
                            const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-12 md:col-span-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingInput 
                          placeholder="SKU"
                          type="text"
                          className="bg-background/60"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-4">
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 pt-4 pb-1 bg-background/60 relative focus:border-primary focus:border-2 border-outline focus:ring-0">
                            <span className="absolute left-3 top-2 text-xs pointer-events-none">Condition</span>
                            <SelectValue className="text-left pt-2" placeholder=" " />
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
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingTextarea
                      placeholder="Description"
                      className="h-32 bg-background/60"
                      minLength={8}
                      maxLength={64}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start gap-6 bg-card/30 rounded-lg p-6 shadow-sm border border-border/40">
            <div className="w-full md:w-3/4">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TagsField
                        maxTags={10}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Add Tags"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Optional. Tags added: {field.value.length} / 10</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-center md:justify-end md:w-1/4">
              <Button 
                type="submit" 
                className="w-full md:w-auto px-8 mt-1 h-12 text-base font-medium rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Submit Listing
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}