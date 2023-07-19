-- CreateEnum
CREATE TYPE "SellerCategory" AS ENUM ('Bar', 'Brewer');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('WhiteSpirit', 'Rum', 'Gin');

-- CreateTable
CREATE TABLE "Seller" (
    "id" SERIAL NOT NULL,
    "place_name" TEXT NOT NULL,
    "operating_time" TEXT[],
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "category" "SellerCategory" NOT NULL,
    "product_category" "ProductCategory" NOT NULL,
    "imges" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_id_key" ON "Seller"("id");
