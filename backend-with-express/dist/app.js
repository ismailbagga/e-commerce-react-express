"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const zod_1 = require("zod");
const router_1 = require("./routers/router");
const zod_validation_error_1 = require("zod-validation-error");
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("./controllers/ApiError"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use("/api/products", router_1.productRouter);
app.use("/api/user", router_1.userRouter);
app.use((err, req, res, next) => {
    if (err instanceof ApiError_1.default)
        return res.status(err.status).json({ message: err.message });
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError)
        return res.status(400).json({ message: "something went wrong saving data try again" });
    if (err instanceof zod_1.z.ZodError) {
        let { message } = (0, zod_validation_error_1.fromZodError)(err);
        message = message.replace(/"/g, "'");
        return res.status(416).json({ message });
    }
    res.status(400).json({ message: "Ops Something Went Wrong !" });
});
app.listen(4000, () => {
    console.log("---------------------------------------- Server start ---------------------------------------------------");
});
