export const imageSizeValidator = (maxSize: number) => {
  return (file: any) => file?.size <= maxSize;
};

export const imageTypeValidator = (availableTypes: string[]) => {
  return (file: any) => availableTypes.includes(file?.type);
};
