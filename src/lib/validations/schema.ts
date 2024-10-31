import { z } from "zod";



// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  photos: z.array(z.string().url()),
  title: z.string().min(8).max(64),
  price: z.number().int().nonnegative().lte(999999999),
  sku: z.string().min(1).max(64).optional(),
  condition: z.string(),
  category: z.string(),
  description: z.string(),  
  tags: z.array(z.string())
});


export type TaskType = z.infer<typeof taskSchema>;
