/*
  Warnings:

  - You are about to drop the column `product_category` on the `Seller` table. All the data in the column will be lost.
  - Added the required column `product_category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "product_category" "ProductCategory" NOT NULL,
ADD COLUMN     "sellerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "product_category";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
