import { Product } from "@prisma/client";
import { z } from "zod";
export const ProductBody = z.object({
  // id: z.bigint().optional(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  price: z.number().min(0, "price moust be positive"),
});

export type ProductPreview = { ratingCount: number; rating: number } & Product;

export const RatingLevel = z.coerce
  .number()
  .min(1, "rating must be less then 1")
  .max(4, "rating can be bigger then 4")
  .optional();
export const Price = z.coerce
  .number()
  .min(1, "Price Must Be more then 1$")
  .optional();

export const HomePageNumber = z.coerce
  .number()
  .min(1)
  .max(4)
  .catch(() => 1);
export const SearchPageNumber = z
  .number()
  .min(1)
  .catch(() => 1);

// type ProductBody = z.infer<typeof ProductBody>;

export const HomeProductListingCategory = z
  .union([
    z.literal("latest"),
    z.literal("top-selling"),
    z.literal("top-rated"),
  ])
  .default("latest");

export const SearchProductListingCategory = z
  .union([z.literal("latest"), z.literal("top-selling"), z.literal("featured")])
  .default("latest");
