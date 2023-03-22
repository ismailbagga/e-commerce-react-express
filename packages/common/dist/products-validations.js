"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProductListingCategory = exports.HomeProductListingCategoryValidator = exports.SearchPageNumber = exports.HomePageNumber = exports.Price = exports.RatingLevel = exports.ProductUpload = void 0;
const zod_1 = require("zod");
exports.ProductUpload = zod_1.z.object({
    // id: z.bigint().optional(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    url: zod_1.z.string(),
    price: zod_1.z.number().min(0, "price must be positive"),
    categories: zod_1.z.array(zod_1.z.number().min(1)).optional(),
});
exports.RatingLevel = zod_1.z.coerce
    .number()
    .min(1, "rating must be less then 1")
    .max(4, "rating can be bigger then 4")
    .optional();
exports.Price = zod_1.z.coerce
    .number()
    .min(1, "Price Must Be more then 1$")
    .optional();
exports.HomePageNumber = zod_1.z.coerce
    .number()
    .min(1)
    .max(4)
    .catch(() => 1);
exports.SearchPageNumber = zod_1.z
    .number()
    .min(1)
    .catch(() => 1);
// type ProductBody = z.infer<typeof ProductBody>;
exports.HomeProductListingCategoryValidator = zod_1.z
    .union([
    zod_1.z.literal("latest"),
    zod_1.z.literal("top-selling"),
    zod_1.z.literal("top-rated"),
])
    .default("latest");
exports.SearchProductListingCategory = zod_1.z
    .union([zod_1.z.literal("latest"), zod_1.z.literal("top-selling"), zod_1.z.literal("featured")])
    .default("latest");
