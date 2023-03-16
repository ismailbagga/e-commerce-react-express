import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { z } from "zod";
import { productRouter, userRouter } from "./routers/router";
import { fromZodError } from "zod-validation-error";
import { Prisma } from "@prisma/client";
import cors from "cors";
import ApiError from "./controllers/ApiError";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api/products", productRouter);
app.use("/api/user", userRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError)
    return res.status(err.status).json({ message: err.message });

  if (err instanceof Prisma.PrismaClientKnownRequestError)
    return res
      .status(400)
      .json({ message: "something went wrong saving data try again" });

  if (err instanceof z.ZodError) {
    let { message } = fromZodError(err);
    message = message.replace(/"/g, "'");
    return res.status(416).json({ message });
  }
  res.status(400).json({ message: "Ops Something Went Wrong !" });
});

app.listen(4000, () => {
  console.log(
    "---------------------------------------- Server start ---------------------------------------------------"
  );
});
