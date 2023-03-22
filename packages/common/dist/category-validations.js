"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryUpload = void 0;
const zod_1 = require("zod");
exports.CategoryUpload = zod_1.z.object({
    title: zod_1.z.string().max(255),
});
