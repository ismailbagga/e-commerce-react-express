import { Product, rating } from "@prisma/client";
import { ProductPreview } from "../controllers/ProductController";

const calculateProductsRating = (latestProducts: (Product & { rating: rating[] })[], rating: number) => {
  const finalResult: ProductPreview[] = [];

  latestProducts.forEach((product) => {
    const ratingCount = product.rating.length;
    if (ratingCount === 0) return !rating && finalResult.push({ ...product, ratingCount, rating: 0 });

    const calc_rating = product.rating.reduce((prev, curr) => prev + curr.rating, 0) / ratingCount;

    if (rating && calc_rating < rating) return;
    finalResult.push({ ...product, rating: calc_rating, ratingCount });
  });

  return finalResult;
};
