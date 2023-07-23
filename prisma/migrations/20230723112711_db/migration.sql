/*
  Warnings:

  - You are about to drop the column `imges` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_productId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropIndex
DROP INDEX "Seller_id_key";

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "imges",
ADD COLUMN     "images" TEXT[],
ADD CONSTRAINT "Seller_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Comment";

-- CreateTable
CREATE TABLE "FavSeller" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FavSeller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavProduct" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FavProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavSeller_id_key" ON "FavSeller"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FavProduct_id_key" ON "FavProduct"("id");

-- AddForeignKey
ALTER TABLE "FavSeller" ADD CONSTRAINT "FavSeller_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavSeller" ADD CONSTRAINT "FavSeller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavProduct" ADD CONSTRAINT "FavProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavProduct" ADD CONSTRAINT "FavProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
