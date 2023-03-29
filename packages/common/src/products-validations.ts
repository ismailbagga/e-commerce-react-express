import { z } from "zod";

export const ProductUpload = z.object({
  // id: z.bigint().optional(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  price: z.number().min(0, "price  must be positive"),
  categories: z.array(z.number().min(1)).optional(),
});
export type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  url: string;
  price: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};
export type ProductRating = {
  id: number;
  title: string;
  slug: string;
  description: string;
  url: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  total_votes: number;
};

export type ProductPaginationResult = {
  count: number;
  products: Product[];
};

export type ProductPreview = { ratingCount: number; rating: number } & Product;

export const RatingLevelValidator = z.coerce.number().min(1).max(4).optional();
export type RatingLevel = 1 | 2 | 3 | 4 | undefined;
export const priceValidator = z.coerce
  .number()
  .min(1, "Price Must Be more then 1$")
  .optional()
  .catch(undefined);

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

export const HomeProductListingCategoryValidator = z
  .union([z.literal("latest"), z.literal("top-selling"), z.literal("top-rated")])
  .default("latest");
export type HomeProductListingCategory = z.infer<typeof HomeProductListingCategoryValidator>;
export const SearchProductListingCategory = z
  .union([z.literal("latest"), z.literal("top-selling"), z.literal("featured")])
  .default("latest");
export type ProductListing = z.infer<typeof SearchProductListingCategory>;
