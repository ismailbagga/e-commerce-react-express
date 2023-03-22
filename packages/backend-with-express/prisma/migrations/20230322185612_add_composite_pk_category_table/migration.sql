/*
  Warnings:

  - The primary key for the `CategoriesOnProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CategoriesOnProducts" DROP CONSTRAINT "CategoriesOnProducts_pkey",
ADD CONSTRAINT "CategoriesOnProducts_pkey" PRIMARY KEY ("productId", "categoryId");
