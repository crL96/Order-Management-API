/*
  Warnings:

  - You are about to drop the `ProductOrderQuantity` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `products` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductOrderQuantity" DROP CONSTRAINT "ProductOrderQuantity_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductOrderQuantity" DROP CONSTRAINT "ProductOrderQuantity_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "products" JSONB NOT NULL;

-- DropTable
DROP TABLE "public"."ProductOrderQuantity";
