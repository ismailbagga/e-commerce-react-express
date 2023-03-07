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
exports.saveProduct = exports.getProducts = exports.getLatestProducts = void 0;
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
const getLatestProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.getLatestProducts = getLatestProducts;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orderByDict = { createdAt: "asc" };
        console.log(req.query);
        const searchBy = req.query.searchBy;
        const term = req.query.term;
        const rating = RatingLevel.parse(req.query.rating);
        const minPrice = Price.parse(req.query.minPrice);
        const maxPrice = Price.parse(req.query.maxPrice);
        const pageSize = 10;
        const page = 1;
        if (searchBy === "top-selling")
            orderByDict = {};
        if (searchBy === "top-rated")
            orderByDict = {};
        // SELECT prd
        const latestProducts = yield prisma_client_1.default.product.findMany({
            include: { rating: true },
            where: {
                price: { gte: minPrice, lte: maxPrice },
                title: { contains: term, mode: "insensitive" },
            },
            orderBy: orderByDict,
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
exports.getProducts = getProducts;
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
