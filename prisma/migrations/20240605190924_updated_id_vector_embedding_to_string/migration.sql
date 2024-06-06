/*
  Warnings:

  - The primary key for the `VectorEmbedding` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "VectorEmbedding" DROP CONSTRAINT "VectorEmbedding_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "VectorEmbedding_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VectorEmbedding_id_seq";
