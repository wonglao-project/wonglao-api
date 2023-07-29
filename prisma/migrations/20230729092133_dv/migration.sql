/*
  Warnings:

  - You are about to drop the `FavProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavSeller` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_name` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FavProduct" DROP CONSTRAINT "FavProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "FavProduct" DROP CONSTRAINT "FavProduct_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavSeller" DROP CONSTRAINT "FavSeller_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "FavSeller" DROP CONSTRAINT "FavSeller_userId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "product_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "FavProduct";

-- DropTable
DROP TABLE "FavSeller";
