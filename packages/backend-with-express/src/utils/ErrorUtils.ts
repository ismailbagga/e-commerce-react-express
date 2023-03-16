import { ZodError } from "zod";

export const parseZodError = (zodError: ZodError) => {
  return " is required ";
};
