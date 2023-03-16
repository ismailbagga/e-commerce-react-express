import { RequestHandler } from "express";
import { z } from "zod";

import bcrypt from "bcrypt";

import prismaClient from "../utils/prisma-client";
const UserBody = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/g),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

export const registerUser: RequestHandler = async (req, res, next) => {
  const result = UserBody.safeParse(req.body);
  if (!result.success) return next(result.error);

  const password = await bcrypt.hash(result.data.password, 10);
  const user = await prismaClient.user.create({
    data: { ...result.data, password },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
  return res.status(201).json(user);
};
