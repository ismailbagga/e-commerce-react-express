import { z } from "zod";

export const imageSizeValidator = (maxSize: number) => {
  return (file: any) => file?.size <= maxSize;
};

export const imageTypeValidator = (availableTypes: string[]) => {
  return (file: any) => availableTypes.includes(file?.type);
};

export const TableId = z.coerce.number().min(1).optional();
