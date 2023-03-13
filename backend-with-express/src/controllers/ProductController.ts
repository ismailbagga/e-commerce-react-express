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

const RatingLevel = z.coerce
  .number()
  .min(1, "rating must be less then 1")
  .max(4, "rating can be bigger then 4")
  .optional();
const Price = z.coerce.number().min(1, "Price Must Be more then 1$").optional();

const HomePageNumber = z.coerce
  .number()
  .min(1)
  .max(4)
  .catch(() => 1);
const SearchPageNumber = z
  .number()
  .min(1)
  .catch(() => 1);

const FromPageTitle = z
  .union([z.literal("HOME_PAGE"), z.literal("SEARCH_PAGE")])
  .catch("HOME_PAGE");
type FromPageTitle = z.infer<typeof FromPageTitle>;
// type ProductBody = z.infer<typeof ProductBody>;

const ProductListingCategory = z
  .union([
    z.literal("latest"),
    z.literal("top-selling"),
    z.literal("top-rated"),
  ])
  .default("latest");

export const getHomePageProducts: RequestHandler = async (req, res, next) => {
  try {
    const listingCategory = ProductListingCategory.parse(req.query.listing);
    console.log(listingCategory);

    const PAGE_SIZE = 2;
    // 4 + 4 + 4 + 3
    const MAX_PRODUCTS_TO_SHOW = PAGE_SIZE * 3;
    const page = HomePageNumber.parse(req.query.page);

    let productsCount = await prismaClientInstance.product.count();
    if (productsCount > MAX_PRODUCTS_TO_SHOW)
      productsCount = MAX_PRODUCTS_TO_SHOW;

    const pagination = {
      take: PAGE_SIZE + (page === 4 ? 0 : 1),
      skip: (page - 1) * PAGE_SIZE,
    };

    if (listingCategory === "top-selling")
      return res.status(200).json({ count: productsCount, products: [] });
    let orderBy: Prisma.ProductWithRatingOrderByWithRelationInput = {
      rating: "desc",
    };

    if (listingCategory === "latest") {
      orderBy = {
        createdAt: "desc",
      };
    }

    const products = await prismaClientInstance.productWithRating.findMany({
      orderBy,
      ...pagination,
    });
    res.status(200).json({ count: productsCount, products });
  } catch (err) {
    next(err);
  }
};

export const getTopSellingProducts: RequestHandler = async (req, res, next) => {
  const productsIdResult = await prismaClientInstance.product.findMany({});

  res.status(200).json(productsIdResult);
};

export const getLatestProducts: RequestHandler = async (req, res, next) => {
  try {
    const term = req.query.term as string;
    const from = FromPageTitle.parse(req.query.from);
    const rating = RatingLevel.parse(req.query.rating);
    const minPrice = Price.parse(req.query.minPrice);
    const maxPrice = Price.parse(req.query.maxPrice);
    const page = SearchPageNumber.parse(req.query.page);
    let PAGE_SIZE = 10;

    const latestProducts =
      await prismaClientInstance.productWithRating.findMany({
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
  if (product)
    return next(new ApiError("product with this title already exists", 405));
  try {
    const newProduct = await prismaClientInstance.product.create({
      data: { ...result.data, slug: productSlug },
    });
    res.status(201).json(newProduct);
  } catch (err) {
    return next(err);
  }
};
