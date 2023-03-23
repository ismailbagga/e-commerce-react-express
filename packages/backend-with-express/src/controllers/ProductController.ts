import { z } from "zod";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";
import prismaClientInstance from "../utils/prisma-client";
import ApiError from "./ApiError";
import slugify from "slugify";
import {
  HomePageNumber,
  HomeProductListingCategory,
  Price,
  RatingLevel,
  SearchPageNumber,
  SearchProductListingCategory,
} from "../types/products-t-v";
import { ProductUpload, TableId } from "@site-wrapper/common";

export const getHomePageProducts: RequestHandler = async (req, res, next) => {
  try {
    const listingCategory = HomeProductListingCategory.parse(req.query.listing);
    const page = HomePageNumber.parse(req.query.page);

    if (listingCategory === "top-selling") return res.status(200).json([]);
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
      take: 10,
    });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const searchForProducts: RequestHandler = async (req, res, next) => {
  try {
    const listingCategory = SearchProductListingCategory.parse(
      req.query.listing
    );
    const term = req.query.term as string;
    const rating = RatingLevel.parse(req.query.rating);
    const minPrice = Price.parse(req.query.minPrice);
    const maxPrice = Price.parse(req.query.maxPrice);
    const page = SearchPageNumber.parse(req.query.page);
    const categoryId = TableId.parse(req.query.categoryId);
    const PAGE_SIZE = 10;

    const where: Prisma.ProductWithRatingWhereInput = {
      title: { contains: term, mode: "insensitive" },
      rating: { gte: rating },
      price: { lte: minPrice, gte: maxPrice },
      CategoriesOnProducts: { some: { categoryId } },
    };
    const pagination = {
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    };

    if (listingCategory === "top-selling") {
      return res.status(200).json({ count: 50, products: [] });
    }

    let orderBy: Prisma.ProductWithRatingOrderByWithRelationInput = {
      rating: "desc",
    };

    if (listingCategory === "latest") {
      orderBy = {
        createdAt: "desc",
      };
    }
    const products = await prismaClientInstance.productWithRating.findMany({
      where,
      orderBy,

      ...pagination,
    });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const saveProduct: RequestHandler = async (req, res, next) => {
  const result = await ProductUpload.safeParse(req.body);
  if (!result.success) return next(result.error);
  const { data } = result;
  const productSlug = slugify(data.title.toLowerCase());
  const product = await prismaClientInstance.product.findFirst({
    where: {
      slug: productSlug,
    },
  });
  if (product)
    return next(new ApiError("product with this title already exists", 405));
  try {
    if (data.categories) {
      const categoriesCount = await prismaClientInstance.category.aggregate({
        _count: { id: true },
        where: {
          id: {
            in: data.categories,
          },
        },
      });
      if (data.categories.length !== categoriesCount._count.id)
        throw new ApiError("Some Categories Selected were not found", 404);
    }

    const newProduct = await prismaClientInstance.product.create({
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        price: data.price,
        slug: productSlug,
      },
    });
    if (data.categories)
      await prismaClientInstance.$executeRaw`INSERT INTO public."CategoriesOnProducts"("productId", "categoryId")
	              VALUES ${Prisma.join(
                  data.categories.map(
                    (id) => Prisma.sql`(${Prisma.join([newProduct.id, id])})`
                  )
                )};`;
    res.status(201).json(newProduct);
  } catch (err) {
    return next(err);
  }
};
