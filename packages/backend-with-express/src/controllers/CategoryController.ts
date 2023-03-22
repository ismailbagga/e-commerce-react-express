import { CategoryUpload } from "@site-wrapper/common";
import { RequestHandler } from "express";
import prisma from "../utils/prisma-client";
import slugify from "slugify";
import ApiError from "./ApiError";

export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.file);
    if (!req.file) throw new ApiError("Image Does not exists", 409);
    const category = await CategoryUpload.parseAsync(req.body);
    const path = req.file.path as string;
    const slug = slugify(category.title.toLocaleLowerCase());
    console.log("slug =>", slug);

    const categoryWithSlug = await prisma.category.findFirst({
      where: { slug: slug },
    });

    console.log(categoryWithSlug);

    if (categoryWithSlug !== null)
      throw new ApiError("Product With Title Already Exists", 409);
    const saved = await prisma.category.create({
      data: {
        title: category.title,
        slug,
        url: req.file?.filename,
      },
    });
    res.json(saved);
  } catch (e) {
    console.log();

    next(e);
  }
};
