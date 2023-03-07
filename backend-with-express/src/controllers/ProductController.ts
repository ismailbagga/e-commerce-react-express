import { Prisma, Product } from "@prisma/client";
import { RequestHandler } from "express";
import { late, unknown, z } from "zod";
import prismaClientInstance from "../utils/prisma-client";
import { title } from "process";
import ApiError from "./ApiError";
import slugify from "slugify";
const ProductBody = z.object({
  // id: z.bigint().optional(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  price: z.number().min(0, "price moust be positive"),
});

export type ProductPreview = { ratingCount: number; rating: number } & Product;

const RatingLevel = z.coerce.number().min(1, "rating van be less then 1").max(4, "rating can be bigger then 4").optional();
const Price = z.coerce.number().min(1, "Price Must Be more then 1$").optional();
// type ProductBody = z.infer<typeof ProductBody>;
type ProductListingType = "latest" | "top-selling" | "top-rated" | undefined;




export const getLatestProducts : RequestHandler = async (req,res,next) => {

}




export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    let orderByDict: Prisma.ProductOrderByWithRelationInput = { createdAt: "asc" };
    console.log(req.query);

    const searchBy = req.query.searchBy as ProductListingType;
    const term = req.query.term as string;
    const rating = RatingLevel.parse(req.query.rating);
    const minPrice = Price.parse(req.query.minPrice);
    const maxPrice = Price.parse(req.query.maxPrice);
    const pageSize =  10
    const page =  1 ; 

    if (searchBy === "top-selling") orderByDict = {};
    if (searchBy === "top-rated") orderByDict = {};

    // SELECT prd

    const latestProducts = await prismaClientInstance.product.findMany({
      include: { rating: true },
      
      where: {
        price: { gte: minPrice, lte: maxPrice },
        title: { contains: term, mode: "insensitive" },
      },
      orderBy: orderByDict,
    });
    const finalResult: ProductPreview[] = [];

    latestProducts.forEach((product) => {
      const ratingCount = product.rating.length;
      if (ratingCount === 0) return !rating && finalResult.push({ ...product, ratingCount, rating: 0 });

      const calc_rating = product.rating.reduce((prev, curr) => prev + curr.rating, 0) / ratingCount;

      if (rating && calc_rating < rating) return;
      finalResult.push({ ...product, rating: calc_rating, ratingCount });
    });

    res.status(200).json(finalResult);
  } catch (err) {
    next(err);
  }

  //
};

export const saveProduct: RequestHandler = async (req, res, next) => {
  const result = await ProductBody.safeParse(req.body);
  if (!result.success) return next(result.error);
  const productSlug = slugify(result.data.title);
  const product = await prismaClientInstance.product.findFirst({
    where: {
      slug: productSlug,
    },
  });
  if (product) return next(new ApiError("product with this title already exists", 405));
  try {
    const newProduct = await prismaClientInstance.product.create({
      data: { ...result.data, slug: productSlug },
    });
    res.status(201).json(newProduct);
  } catch (err) {
    return next(err);
  }
};
