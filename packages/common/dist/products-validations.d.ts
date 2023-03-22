import { z } from "zod";
export declare const ProductBody: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    url: z.ZodString;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    url: string;
    price: number;
}, {
    title: string;
    description: string;
    url: string;
    price: number;
}>;
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
export type ProductPaginationResult = {
    count: number;
    products: Product[];
};
export type ProductPreview = {
    ratingCount: number;
    rating: number;
} & Product;
export declare const RatingLevel: z.ZodOptional<z.ZodNumber>;
export declare const Price: z.ZodOptional<z.ZodNumber>;
export declare const HomePageNumber: z.ZodCatch<z.ZodNumber>;
export declare const SearchPageNumber: z.ZodCatch<z.ZodNumber>;
export declare const HomeProductListingCategoryValidator: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"latest">, z.ZodLiteral<"top-selling">, z.ZodLiteral<"top-rated">]>>;
export type HomeProductListingCategory = z.infer<typeof HomeProductListingCategoryValidator>;
export declare const SearchProductListingCategory: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"latest">, z.ZodLiteral<"top-selling">, z.ZodLiteral<"featured">]>>;
