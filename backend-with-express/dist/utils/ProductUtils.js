"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateProductsRating = (latestProducts, rating) => {
    const finalResult = [];
    latestProducts.forEach((product) => {
        const ratingCount = product.rating.length;
        if (ratingCount === 0)
            return !rating && finalResult.push(Object.assign(Object.assign({}, product), { ratingCount, rating: 0 }));
        const calc_rating = product.rating.reduce((prev, curr) => prev + curr.rating, 0) / ratingCount;
        if (rating && calc_rating < rating)
            return;
        finalResult.push(Object.assign(Object.assign({}, product), { rating: calc_rating, ratingCount }));
    });
    return finalResult;
};
