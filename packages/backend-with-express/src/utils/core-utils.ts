import { FileFilterCallback, MulterError } from "multer";
import ApiError from "../controllers/ApiError";

export const imageTypeValidator = (
  maxSizeInByte: number,
  allowedType: string[]
) => {
  return (
    req: any,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    if (!allowedType.includes(file.mimetype))
      callback(new ApiError("Invalid Image Type", 400));
    else callback(null, true);
  };
};
