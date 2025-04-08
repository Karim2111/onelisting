"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import React, { useState, useRef, useCallback, useEffect } from "react"


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
import { generateFields } from "~/server/db/listings/actions";
const descriptionMinLength = 8;
const descriptionMaxLength = 2500;
const titleMinLength = 8;
const titleMaxLength = 64;
const skuMaxLength = 64;
const priceMinValue = 0;
const priceMaxValue = 999999999;

const CONDITIONS = ["brand-new", "like-new", "good", "fair"] as const;
type Condition = typeof CONDITIONS[number];

export const formSchema = z.object({
  photos: z.array(z.string().url()).min(1),
  title: z.string().min(titleMinLength).max(titleMaxLength),
  price: z.number().int().nonnegative().gte(priceMinValue).lte(priceMaxValue),
  sku: z.string().max(skuMaxLength).optional(),
  condition: z.enum(CONDITIONS),
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

export type FormValues = z.infer<typeof formSchema>;

// Add this interface for the AI response
interface AIResponse {
  title?: string;
  description?: string;
  price?: number;
  sku?: string;
  condition?: string;
  tags?: string[];
  category?: {
    id: number;
    name: string;
  };
}

export default function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      tags: [], 
      price: undefined,
      title: '',
      description: '',
      sku: '',
      photos: [],
      category: '',
      condition: "brand-new",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const { toast } = useToast();
  const router = useRouter();
  const uploadedUrlsRef = React.useRef<string[]>([]);
  const [lastUploadUpdate, setLastUploadUpdate] = React.useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTime, setGenerationTime] = useState(0);
  const generationTimer = useRef<NodeJS.Timeout>();
  const startTime = useRef<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiNote, setAiNote] = useState<string>("");
  const [isAiNoteOpen, setIsAiNoteOpen] = useState(false);

  const handleUploaded = React.useCallback((urls: string[]) => {
    console.log("Image URLs updated:", urls);
    uploadedUrlsRef.current = urls;
    setLastUploadUpdate(Date.now()); // Trigger the effect
  }, []);

  // Use an effect to update the form state when uploadedUrlsRef changes
  React.useEffect(() => {
    if (lastUploadUpdate === 0) return; // Skip initial render
    
    const urls = uploadedUrlsRef.current;
    if (urls && urls.length >= 0) { // Include empty arrays to clear validation
      form.setValue('photos', urls, { shouldValidate: true });
    }
  }, [form, lastUploadUpdate]);

  // Watch for photos field changes to monitor validation
  const photos = form.watch('photos');
  const hasPhotos = photos && photos.length > 0;

  const updateGenerationTime = useCallback(() => {
    if (startTime.current) {
      const elapsed = (Date.now() - startTime.current) / 1000;
      setGenerationTime(elapsed);
    }
  }, []);

  useEffect(() => {
    if (isGenerating) {
      startTime.current = Date.now();
      generationTimer.current = setInterval(() => {
        updateGenerationTime();
      }, 10); // Update every 10ms for smooth counter
    } else {
      if (generationTimer.current) {
        clearInterval(generationTimer.current);
      }
      startTime.current = 0;
      setGenerationTime(0);
    }
    return () => {
      if (generationTimer.current) {
        clearInterval(generationTimer.current);
      }
    };
  }, [isGenerating, updateGenerationTime]);

  const onSubmit = async (values: FormValues) => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    try {
      await insertListingToDb(values);
      router.push("/dashboard");
      setTimeout(() => {
        toast({
          title: "Success!",
          description: "Listing created successfully.",
          duration: 3000
        });
      }, 500);

      
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        title: "Error",
        description: "Failed to create the listing.",
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGenerateFields = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (photos && photos.length > 0) {
      try {
        setIsGenerating(true);
        const response = await generateFields(photos, aiNote);
        console.log('AI Response:', response); // Debug log

        if (!response) {
          console.error('No response from AI');
          return;
        }

        let data: AIResponse;
        try {
          data = JSON.parse(response) as AIResponse;
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          return;
        }
        
        console.log('Parsed data:', data); // Debug log

        // Update form fields with the generated data
        if (data.title) {
          form.setValue('title', data.title, { shouldValidate: true });
          console.log('Set title to:', data.title);
        }
        
        if (data.description) {
          form.setValue('description', data.description, { shouldValidate: true });
          console.log('Set description to:', data.description);
        }
        
        if (typeof data.price === 'number') {
          form.setValue('price', data.price, { shouldValidate: true });
          console.log('Set price to:', data.price);
        }
        
        if (data.sku) {
          form.setValue('sku', data.sku, { shouldValidate: true });
          console.log('Set sku to:', data.sku);
        }
        
        if (data.condition) {
          // Ensure the condition is one of the valid enum values
          const condition = data.condition as Condition;
          if (CONDITIONS.includes(condition)) {
            form.setValue('condition', condition, { shouldValidate: true });
            console.log('Set condition to:', condition);
          } else {
            console.error('Invalid condition value:', data.condition);
          }
        }
        
        // Handle tags
        if (data.tags && Array.isArray(data.tags)) {
          form.setValue('tags', data.tags, { shouldValidate: true });
          console.log('Set tags to:', data.tags);
        }
        
        // Handle category with ID-name format
        if (data.category?.id && data.category?.name) {
          const categoryValue = `${data.category.id} - ${data.category.name}`;
          form.setValue('category', categoryValue, { shouldValidate: true });
          console.log('Set category to:', categoryValue);
        }

        // Log all form values after setting them
        console.log('Form values after update:', form.getValues());

      } catch (error) {
        console.error('Error handling AI response:', error);
      } finally {
        setIsGenerating(false);
      }
    } else {
      console.log('No photos available');
    }
  };

  return (
    <div className="w-full max-w-3xl overflow-auto max-h-[100%] mx-auto p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight text-center mb-8">
        List Your Item
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className={`bg-card/30 rounded-lg p-6 shadow-sm border ${hasPhotos ? 'border-border/40' : 'border-destructive/40'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Product Images</h3>
              <div className="text-sm text-muted-foreground">
                {hasPhotos ? (
                  <span className="text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {photos.length} image(s)
                  </span>
                ) : (
                  <span className="text-destructive flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Required
                  </span>
                )}
              </div>
            </div>
            <FormField
              control={form.control}
              name="photos"
              render={({ field, fieldState }) => (
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
            {photos && photos.length > 0 && (
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Important info missing from photos?{' '}
                    <button
                      type="button"
                      onClick={() => setIsAiNoteOpen(!isAiNoteOpen)}
                      className="text-primary hover:underline font-medium inline-flex items-center"
                    >
                      Add a note for AI
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={`ml-1 transition-transform duration-200 ${isAiNoteOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                  </p>
                  <Button 
                    type="button" 
                    onClick={handleGenerateFields}
                    className="relative whitespace-nowrap"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating ({generationTime.toFixed(2)}s)
                        </span>
                      </>
                    ) : (
                      'Generate Fields'
                    )}
                  </Button>
                </div>

                {/* Collapsible note textarea */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isAiNoteOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <FloatingTextarea
                    placeholder="Add a note for AI (optional)"
                    value={aiNote}
                    onChange={(e) => setAiNote(e.target.value)}
                    className="h-20 bg-background/60"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add any specific details or requirements you want the AI to consider
                  </p>
                </div>
              </div>
            )}
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
                      minLength={titleMinLength}
                      maxLength={titleMaxLength}
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
                  <FormControl>
                    <FloatingInput 
                      placeholder="Category"
                      type="text"
                      {...field}
                      className="bg-background/60"
                    />
                  </FormControl>
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
                          value={field.value === 0 ? '' : field.value}
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 pt-4 pb-1 bg-background/60 relative focus:border-primary focus:border-2 border-outline focus:ring-0">
                            <span className="absolute left-3 top-2 text-xs pointer-events-none">Condition</span>
                            <SelectValue className="text-left pt-2" placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="brand-new">Brand new</SelectItem>
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
                      minLength={descriptionMinLength}
                      maxLength={descriptionMaxLength}
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
                        className="w-full"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Optional. Tags added: {field.value.length} / 10</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-center md:justify-end md:w-1/4 mt-4 md:mt-0">
              <Button 
                type="submit" 
                className="w-full md:w-auto px-8 h-12 text-base font-medium rounded-full shadow-md hover:shadow-lg transition-all"
                disabled={isSubmitting || !hasPhotos}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Listing'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}