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
const HomePage = z
  .number()
  .min(1)
  .max(4)
  .catch(() => 1);
const SearchPage = z
  .number()
  .min(1)
  .catch(() => 1);

const FromPage = z.union([z.literal("HOME_PAGE"), z.literal("SEARCH_PAGE")]).catch(() => "HOME_PAGE");
type FromPage = z.infer<typeof FromPage>;
// type ProductBody = z.infer<typeof ProductBody>;
type ProductListingType = "latest" | "top-selling" | "top-rated" | undefined;

export const getTopRatedProducts: RequestHandler = async (req, res, next) => {
  const PAGE_SIZE = 4;
  const page = HomePage.parse(req.query.page);

  let productsCount = await prismaClientInstance.product.count();
  if (productsCount > PAGE_SIZE * 4) productsCount = 4;
  const products = await prismaClientInstance.$queryRaw<ProductPreview>`
    SELECT  pr.id , pr.price , pr.slug , pr.title ,
	          (COALESCE(SUM(r.RATING),0)/count(*)::decimal) as rating ,
	          count(*)::int  as total_votes
      
    FROM public."Product" as  pr
    LEFT JOIN rating as r ON  r."productId" = pr.id

    GROUP BY pr.id , pr.price , pr.slug , pr.title  
    ORDER BY  SUM(r.RATING) / COUNT(*)
    OFFSET ${(page - 1) * PAGE_SIZE}
    LIMIT ${PAGE_SIZE}
  `;
  console.log(products);

  res.status(200).json({ count: productsCount, products });
};

export const getTopSellingProducts: RequestHandler = async (req, res, next) => {
  const page = req.query.page ?? 1;
  const searchBy = (req.query.searchBy as ProductListingType) ?? "latest";
  let queryObject: Prisma.ProductFindManyArgs = { orderBy: { createdAt: "asc" } };
  if (searchBy === "top-selling") queryObject = {};
  if (searchBy === "top-rated") queryObject = {};
  var sql = `
      SELECT p FROM products p 
      LEFT JOIN rating r.productId = p.id  
      
      GROUP BY p.id 
      ORDER sum(r.rating) / count(*)
  `;
  const productsIdResult = await prismaClientInstance.product.findMany({});
  console.log(productsIdResult);
  res.status(200).json(productsIdResult);
};

export const getLatestProducts: RequestHandler = async (req, res, next) => {
  try {
    const term = req.query.term as string;
    const from = FromPage.parse(req.query.from);
    const rating = RatingLevel.parse(req.query.rating);
    const minPrice = Price.parse(req.query.minPrice);
    const maxPrice = Price.parse(req.query.maxPrice);
    const page = SearchPage.parse(req.query.page);
    let PAGE_SIZE = 10;
    if (rating) {
      const products = await prismaClientInstance.$queryRaw<ProductPreview>`
                                    SELECT  pr.id , pr.price , pr.slug , pr.title ,
                                            (COALESCE(SUM(r.RATING),0)/count(*)::decimal) as rating ,
                                            count(*)::int  as total_votes
                                      
                                    FROM public."Product" as  pr
                                    LEFT JOIN rating as r ON  r."productId" = pr.id
                                    WHERE ()
                                    GROUP BY pr.id , pr.price , pr.slug , pr.title  
                                    ORDER BY  SUM(r.RATING) / COUNT(*)
                                    OFFSET ${(page - 1) * PAGE_SIZE}
                                    LIMIT ${PAGE_SIZE}
                                  `;

      return null;
    }

    const latestProducts = await prismaClientInstance.product.findMany({
      include: { rating: true },
      where: {
        price: { gte: minPrice, lte: maxPrice },
        title: { contains: term, mode: "insensitive" },
      },
      skip: PAGE_SIZE * (page - 1),
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
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
