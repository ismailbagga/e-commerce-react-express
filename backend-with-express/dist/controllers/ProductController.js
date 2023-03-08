"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProduct = exports.getLatestProducts = exports.getTopSellingProducts = exports.getTopRatedProducts = void 0;
const zod_1 = require("zod");
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const ApiError_1 = __importDefault(require("./ApiError"));
const slugify_1 = __importDefault(require("slugify"));
const ProductBody = zod_1.z.object({
    // id: z.bigint().optional(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    url: zod_1.z.string(),
    price: zod_1.z.number().min(0, "price moust be positive"),
});
const RatingLevel = zod_1.z.coerce.number().min(1, "rating van be less then 1").max(4, "rating can be bigger then 4").optional();
const Price = zod_1.z.coerce.number().min(1, "Price Must Be more then 1$").optional();
const HomePage = zod_1.z
    .number()
    .min(1)
    .max(4)
    .catch(() => 1);
const SearchPage = zod_1.z
    .number()
    .min(1)
    .catch(() => 1);
const FromPage = zod_1.z.union([zod_1.z.literal("HOME_PAGE"), zod_1.z.literal("SEARCH_PAGE")]).catch(() => "HOME_PAGE");
const getTopRatedProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const PAGE_SIZE = 4;
    const page = HomePage.parse(req.query.page);
    let productsCount = yield prisma_client_1.default.product.count();
    if (productsCount > PAGE_SIZE * 4)
        productsCount = 4;
    const products = yield prisma_client_1.default.$queryRaw `
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
});
exports.getTopRatedProducts = getTopRatedProducts;
const getTopSellingProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const page = (_a = req.query.page) !== null && _a !== void 0 ? _a : 1;
    const searchBy = (_b = req.query.searchBy) !== null && _b !== void 0 ? _b : "latest";
    let queryObject = { orderBy: { createdAt: "asc" } };
    if (searchBy === "top-selling")
        queryObject = {};
    if (searchBy === "top-rated")
        queryObject = {};
    var sql = `
      SELECT p FROM products p 
      LEFT JOIN rating r.productId = p.id  
      
      GROUP BY p.id 
      ORDER sum(r.rating) / count(*)
  `;
    const productsIdResult = yield prisma_client_1.default.product.findMany({});
    console.log(productsIdResult);
    res.status(200).json(productsIdResult);
});
exports.getTopSellingProducts = getTopSellingProducts;
const getLatestProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const term = req.query.term;
        const from = FromPage.parse(req.query.from);
        const rating = RatingLevel.parse(req.query.rating);
        const minPrice = Price.parse(req.query.minPrice);
        const maxPrice = Price.parse(req.query.maxPrice);
        const page = SearchPage.parse(req.query.page);
        let PAGE_SIZE = 10;
        if (rating) {
            const products = yield prisma_client_1.default.$queryRaw `
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
        const latestProducts = yield prisma_client_1.default.product.findMany({
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
        res.status(200).json(finalResult);
    }
    catch (err) {
        next(err);
    }
    //
});
exports.getLatestProducts = getLatestProducts;
const saveProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ProductBody.safeParse(req.body);
    if (!result.success)
        return next(result.error);
    const productSlug = (0, slugify_1.default)(result.data.title);
    const product = yield prisma_client_1.default.product.findFirst({
        where: {
            slug: productSlug,
        },
    });
    if (product)
        return next(new ApiError_1.default("product with this title already exists", 405));
    try {
        const newProduct = yield prisma_client_1.default.product.create({
            data: Object.assign(Object.assign({}, result.data), { slug: productSlug }),
        });
        res.status(201).json(newProduct);
    }
    catch (err) {
        return next(err);
    }
});
exports.saveProduct = saveProduct;
