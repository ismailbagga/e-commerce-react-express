"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageTypeValidator = exports.imageSizeValidator = void 0;
const imageSizeValidator = (maxSize) => {
    return (file) => file?.size <= maxSize;
};
exports.imageSizeValidator = imageSizeValidator;
const imageTypeValidator = (availableTypes) => {
    return (file) => availableTypes.includes(file?.type);
};
exports.imageTypeValidator = imageTypeValidator;
