import { z } from "zod";

export const CategoryUpload = z.object({
  title: z.string().max(255),
});
